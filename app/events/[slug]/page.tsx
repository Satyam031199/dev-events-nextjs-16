import {Suspense} from "react";
import EventDetails from "@/components/EventDetails";

const page = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const slug = params.then((p) => p.slug);
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <EventDetails params={slug} />
            </Suspense>
        </main>
    )
}
export default page