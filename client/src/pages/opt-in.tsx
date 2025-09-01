import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OptInPage() {
  const [consented, setConsented] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (consented) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Consent Recorded</CardTitle>
            <CardDescription>
              Thank you for opting in to VitalWatch SMS alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              You will receive health and device alerts via SMS. Reply STOP to opt out anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>VitalWatch SMS Alerts - Consent</CardTitle>
          <CardDescription>
            Opt in to receive important health alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">SMS Alert Services</h3>
            <p className="text-sm text-gray-600">
              VitalWatch sends non-marketing account, device, and health alerts to users who enable 
              "SMS Alerts" in the app/web dashboard and provide their mobile number.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Message Examples:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Heart rate exceeded your threshold (145 bpm)</li>
                <li>• Your device went offline at 3:22 PM</li>
                <li>• Security alert: New device detected</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              Messages are event-driven (typically 0-10/day). Reply STOP to opt out, 
              HELP for help, or HELP for help. Message and data rates may apply.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="consent" 
              checked={consented}
              onCheckedChange={(checked) => setConsented(checked === true)}
            />
            <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I consent to receive SMS alerts from VitalWatch as described above
            </label>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!consented}
            className="w-full"
          >
            Confirm Opt-In
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By clicking confirm, you agree to receive SMS notifications from VitalWatch. 
            You can opt out at any time by replying STOP.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}