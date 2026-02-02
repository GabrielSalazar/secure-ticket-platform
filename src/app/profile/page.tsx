import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import ProfileForm from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-muted/10">
                <ProfileForm />
            </main>
            <Footer />
        </div>
    );
}
