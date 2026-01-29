import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";


const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = params.then((p) => p.slug);
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <EventDetails params={slug} />
            </Suspense>
        </main>
    );

}

export default EventDetailsPage

// 1. Restart your shell or run: source ~/.bashrc
// 2. Run 'coderabbit auth login' to authenticate