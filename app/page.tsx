import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const Page = async () => {
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  // console.log("🚀 ~ Page ~ events:", events)
  // if (!events) return notFound()

  return (
    <section>
      <h1 className='text-center'>The Hub For Every Dev <br /> Event You can&lsquo;t Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences all in one place.</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Feature Events</h3>

        <ul className='events'>
          {
            events && events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className='list-none'>
                <EventCard {...event} />
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  )
}

export default Page