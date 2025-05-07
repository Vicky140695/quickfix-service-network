
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

// Twilio Helper
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  phoneNumber: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get the request body
    const { phoneNumber } = await req.json() as RequestBody;

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in a hash map with the phone number as the key
    // In a real production app, you would store this in a database with TTL
    // For simplicity, we're using KV - which is a simple key-value store
    const kv = await Deno.openKv();
    
    // Set the OTP with a 5-minute expiry
    const expiryMs = 5 * 60 * 1000; // 5 minutes
    const expiry = new Date(Date.now() + expiryMs);
    
    await kv.set(["otp", phoneNumber], {
      code: otp,
      createdAt: Date.now(),
      expiry: expiry.getTime()
    }, { expireIn: expiryMs });

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error("Twilio configuration is missing");
      return new Response(
        JSON.stringify({
          success: true, 
          debug: true,
          message: "Twilio not configured, but OTP generated and stored",
          otp: otp // Only in development, NEVER return the OTP in production
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Send SMS using Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: phoneNumber,
        Body: `Your QuickFix verification code is: ${otp}. This code will expire in 5 minutes.`,
      }).toString(),
    });

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error("Twilio error:", twilioData);
      return new Response(
        JSON.stringify({ error: "Failed to send OTP via SMS" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "OTP sent successfully",
        verificationId: phoneNumber, // Use the phone number as verification ID
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-otp function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
