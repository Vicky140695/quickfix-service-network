
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  phoneNumber: string;
  otp: string;
  role: "customer" | "worker" | "admin";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get the request body
    const { phoneNumber, otp, role } = await req.json() as RequestBody;

    if (!phoneNumber || !otp) {
      return new Response(
        JSON.stringify({ error: "Phone number and OTP are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Verify the OTP
    const kv = await Deno.openKv();
    const result = await kv.get(["otp", phoneNumber]);
    
    if (!result.value) {
      return new Response(
        JSON.stringify({ success: false, error: "No OTP found for this number" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const storedOtp = result.value as { code: string; createdAt: number; expiry: number };
    
    // Check if OTP has expired
    if (Date.now() > storedOtp.expiry) {
      // Delete the expired OTP
      await kv.delete(["otp", phoneNumber]);
      
      return new Response(
        JSON.stringify({ success: false, error: "OTP has expired" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if OTP matches
    if (storedOtp.code !== otp) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid OTP" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Delete the used OTP
    await kv.delete(["otp", phoneNumber]);

    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        auth: { persistSession: false },
      }
    );

    // Create a pseudo-email from the phone number for Supabase auth
    const pseudoEmail = `${phoneNumber.replace(/[^0-9]/g, '')}@quickfix.example.com`;
    const password = `${phoneNumber.replace(/[^0-9]/g, '')}_secure_pwd`;

    // Check if user exists
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('phone_number', phoneNumber)
      .maybeSingle();

    if (userCheckError) {
      console.error('Error checking existing user:', userCheckError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify user. Database error.' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (existingUser) {
      // User exists, sign them in
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: pseudoEmail,
        options: {
          redirectTo: `${req.url.split('/functions')[0]}/auth/callback`
        }
      });

      if (error || !data) {
        console.error('Auth error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Authentication failed' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: { id: existingUser.id },
          role: existingUser.role,
          authLink: data.properties.action_link
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      // Create new user
      if (!role) {
        return new Response(
          JSON.stringify({ success: false, error: 'User role is required for registration' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Create user in Auth
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: pseudoEmail,
        password: password,
        email_confirm: true
      });

      if (userError || !userData.user) {
        console.error('User creation error:', userError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // Create user record in our users table
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userData.user.id,
          phone_number: phoneNumber,
          role: role,
          is_verified: true
        });

      if (insertError) {
        console.error('User insert error:', insertError);
        // If we can't create a user record, delete the auth user
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
        
        return new Response(
          JSON.stringify({ success: false, error: 'User registration failed' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // If the user is a worker, create an initial worker profile
      if (role === 'worker') {
        const { error: workerProfileError } = await supabaseAdmin
          .from('worker_profiles')
          .insert({
            user_id: userData.user.id,
            skills: [],
            aadhaar_verified: false,
            kyc_status: 'pending',
            available: true,
            payment_completed: false,
            agreed_to_terms: false
          });
        
        if (workerProfileError) {
          console.error('Worker profile creation error:', workerProfileError);
        }
      }
      
      // Initialize wallet for the user
      const referralCode = generateReferralCode();
      const { error: walletError } = await supabaseAdmin
        .from('wallet')
        .insert({
          user_id: userData.user.id,
          balance: 0,
          referral_code: referralCode
        });
        
      if (walletError) {
        console.error('Wallet creation error:', walletError);
      }

      // Generate magic link for the new user
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: pseudoEmail,
        options: {
          redirectTo: `${req.url.split('/functions')[0]}/auth/callback`
        }
      });

      if (error || !data) {
        console.error('Auth link generation error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to generate login link' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: { id: userData.user.id },
          role: role,
          isNewUser: true,
          authLink: data.properties.action_link
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in verify-otp function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Generate a unique referral code
function generateReferralCode(length: number = 6): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}
