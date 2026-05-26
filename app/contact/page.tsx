import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Contact Us - TeeWorld",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Get in Touch</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Have a question or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <Card>
          <CardContent className="flex flex-col items-center pt-6">
            <Mail className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">hello@teeworld.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center pt-6">
            <Phone className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold">Phone</h3>
            <p className="text-sm text-muted-foreground">+91 96093 84607</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center pt-6">
            <MapPin className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold">Address</h3>
            <p className="text-sm text-muted-foreground text-center">
              Sutragarh, Lankapara, Santipur, Nadia, West Bengal, India
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
