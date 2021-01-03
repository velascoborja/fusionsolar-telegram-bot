import { Thing } from "../models/thing";

export function thingToMessage(thing: Thing): string {
    return `🏷 ${thing.name}\n❤️ ${thing.like_count}\n🌐 ${thing.public_url}\n 📥 Download: /dl_${thing.id}`
}