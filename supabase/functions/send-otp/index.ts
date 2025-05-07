
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

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

// Create a simple in-memory store with expiry
// In production, you would use a proper database
const otpStore = new Map();

// Function to clear expired OTPs
const clearExpiredOtps = () => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (value.expiry < now) {
      otpStore.delete(key);
    }
  }
};

// Clean up expired OTPs every minute
setInterval(clearExpiredOtps, 60000);

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

    // Store the OTP with the phone number as the key
    // Set a 5-minute expiry
    const expiryMs = 5 * 60 * 1000; // 5 minutes
    const expiry = new Date(Date.now() + expiryMs);
    
    // Store OTP in our in-memory map
    otpStore.set(phoneNumber, {
      code: otp,
      createdAt: Date.now(),
      expiry: expiry.getTime()
    });
    
    // Schedule automatic deletion after expiry
    setTimeout(() => {
      otpStore.delete(phoneNumber);
    }, expiryMs);

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.log("Twilio configuration is missing");
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
