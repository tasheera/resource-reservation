import { PrismaClient, ReservationStatus } from "@prisma/client";
import { parseLocalDateTime, shiftDate, todayInAppTimezone } from "../lib/format";

const prisma = new PrismaClient();
const today = todayInAppTimezone();

function at(dayOffset: number, time: string) {
  return parseLocalDateTime(`${shiftDate(today, dayOffset)}T${time}`);
}

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.resource.deleteMany();

  const resourceData = [
    { name: "Meeting Room A", type: "ROOM", location: "Floor 1", capacity: 8, description: "Small meeting room with a TV" },
    { name: "Meeting Room B", type: "ROOM", location: "Floor 1", capacity: 6, description: "Quiet room for interviews" },
    { name: "Conference Hall", type: "ROOM", location: "Floor 2", capacity: 50, description: "Large hall for events" },
    { name: "Projector", type: "EQUIPMENT", location: null, capacity: null, description: "Portable HD projector" },
    { name: "Company Van", type: "VEHICLE", location: "Parking", capacity: 9, description: null },
    { name: "Old Boardroom", type: "ROOM", location: "Floor 3", capacity: 12, description: "Under renovation", isActive: false },
  ];

  const ids: Record<string, number> = {};
  for (const data of resourceData) {
    const created = await prisma.resource.create({ data });
    ids[created.name] = created.id;
  }

  const reservations: {
    resource: string;
    name: string;
    purpose: string;
    start: Date;
    end: Date;
    status?: ReservationStatus;
  }[] = [
    // Meeting Room A: two back-to-back bookings tomorrow (allowed, the end is excluded)
    { resource: "Meeting Room A", name: "Ann Perera", purpose: "Team standup", start: at(1, "10:00"), end: at(1, "11:00") },
    { resource: "Meeting Room A", name: "Bob Silva", purpose: "Client call", start: at(1, "11:00"), end: at(1, "12:30") },

    { resource: "Meeting Room A", name: "Eva Jayasinghe", purpose: "Interview", start: at(1, "10:30"), end: at(1, "11:30"), status: "CANCELLED" },
    { resource: "Meeting Room A", name: "Cara Fernando", purpose: "Budget review", start: at(2, "14:00"), end: at(2, "15:00") },
    // A past booking
    { resource: "Meeting Room A", name: "Dinesh Kumar", purpose: "Planning session", start: at(-3, "09:00"), end: at(-3, "10:00") },

    { resource: "Meeting Room B", name: "Eva Jayasinghe", purpose: "Candidate interview", start: at(4, "10:00"), end: at(4, "11:00") },
    { resource: "Conference Hall", name: "Cara Fernando", purpose: "Annual meeting", start: at(3, "09:00"), end: at(3, "13:00") },
    { resource: "Conference Hall", name: "Bob Silva", purpose: "Product launch", start: at(7, "15:00"), end: at(7, "18:00") },
    { resource: "Projector", name: "Dinesh Kumar", purpose: "Workshop demo", start: at(2, "14:00"), end: at(2, "16:00") },
    { resource: "Company Van", name: "Farah Nazeer", purpose: "Site visit", start: at(1, "08:00"), end: at(1, "12:00") },
    { resource: "Company Van", name: "Ann Perera", purpose: "Supplier pickup", start: at(5, "09:00"), end: at(5, "11:00") },
  ];

  for (const r of reservations) {
    await prisma.reservation.create({
      data: {
        resourceId: ids[r.resource],
        bookedByName: r.name,
        bookedByEmail: `${r.name.split(" ")[0].toLowerCase()}@example.com`,
        purpose: r.purpose,
        startTime: r.start,
        endTime: r.end,
        status: r.status ?? "CONFIRMED",
      },
    });
  }

  console.log(`Seeded ${resourceData.length} resources and ${reservations.length} reservations.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());