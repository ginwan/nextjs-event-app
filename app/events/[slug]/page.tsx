import BookEvents from "@/components/BookEvents";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/events.actions";
import { cacheLife } from "next/cache";
import Image from "next/image"
import { notFound } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// Event details reusable component
const EventDetailsItems = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

// Agenda reusable component
const EventAgenda = ({ agenda }: { agenda: string[] }) => (
    <div className="agenda">
        <h3>Agenda</h3>
        <ul>
            {agenda.map((item, index) => (
                <div key={index}>{item}</div>
            ))}
        </ul>
    </div>
)

// Event tags reusable component
const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap mt-4">
        {tags.map((tag, index) => (
            <div className="pill" key={index}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    "use cache";
    cacheLife('hours');
    const { slug } = await params
    const request = await fetch(`${BASE_URL}/api/events/${slug}`)
    const { event: {
        description,
        image,
        overview,
        time,
        date,
        location,
        mode,
        audience,
        agenda,
        organizer,
        tags
    } } = await request.json()
    const bookings = 10;

    // No need to fetch request
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)
    console.log("🚀 ~ EventDetailsPage ~ similarEvents:", similarEvents)


    if (!description) return notFound()

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className="mt-2">{description}</p>
            </div>

            <div className="details">
                {/* Left Side - Event Content */}
                <div className="content">
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailsItems icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailsItems icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailsItems icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailsItems icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailsItems icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda agenda={agenda} />

                    <section>
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>

                {/* Right Side - Booking Form */}
                <div className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {
                            bookings > 0 ?
                                <p className="text-sm">Join {bookings} people who have already booked their spot</p> :
                                <p className="text-sm">Be the first to book your spot</p>
                        }

                        <BookEvents />
                    </div>
                </div>
            </div>

            {/* Similar Events */}
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {
                        similarEvents.length > 0 && similarEvents.map((event: IEvent) => (
                            <EventCard
                                key={event.title}
                                title={event.title}
                                image={event.image}
                                slug={event.slug}
                                location={event.location}
                                date={event.date}
                                time={event.time}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default EventDetailsPage

// 1. Restart your shell or run: source ~/.bashrc
// 2. Run 'coderabbit auth login' to authenticate