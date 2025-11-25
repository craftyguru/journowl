export interface LocationTag {
  id: string;
  entryId: number;
  latitude: number;
  longitude: number;
  placeName: string;
  emoji: string;
  createdAt: Date;
}

class LocationStore {
  private locations: Map<string, LocationTag> = new Map();
  private locationId = 0;

  addLocation(entryId: number, lat: number, lon: number, placeName: string, emoji: string): LocationTag {
    const id = `loc_${++this.locationId}`;
    const location: LocationTag = {
      id,
      entryId,
      latitude: lat,
      longitude: lon,
      placeName,
      emoji,
      createdAt: new Date()
    };
    this.locations.set(id, location);
    return location;
  }

  getLocationForEntry(entryId: number): LocationTag | null {
    return Array.from(this.locations.values()).find(l => l.entryId === entryId) || null;
  }
}

const locationStore = new LocationStore();

export class LocationService {
  static addLocation(entryId: number, lat: number, lon: number, placeName: string, emoji: string): LocationTag {
    return locationStore.addLocation(entryId, lat, lon, placeName, emoji);
  }

  static getLocationForEntry(entryId: number): LocationTag | null {
    return locationStore.getLocationForEntry(entryId);
  }

  static getEmojiForPlace(placeName: string): string {
    const emojis: any = {
      cafe: "☕", home: "🏠", park: "🌳", beach: "🏖️", office: "🏢", 
      library: "📚", gym: "🏋️", train: "🚂", plane: "✈️", mountain: "⛰️"
    };
    return emojis[placeName.toLowerCase()] || "📍";
  }
}
