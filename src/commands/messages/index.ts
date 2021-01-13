import { Thing } from "../../models/thing";

export function thingToMessage(thing: Thing): string {
    return `🏷 ${thing.name}\n❤️ ${thing.like_count}\n🌐 ${thing.public_url}\n📂 Files: /dl_${thing.id}\n⬇️ Download ZIP: /zip_${thing.id}`
}

export function getSetUsernameMessage(): string {
    return 'Now send me your Thingiverse username 🧑‍💻'
}