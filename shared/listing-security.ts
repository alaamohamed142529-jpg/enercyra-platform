export function canManageListing(ownerId: number, actorId: number): boolean {
  return Number.isInteger(ownerId) && Number.isInteger(actorId) && ownerId > 0 && actorId > 0 && ownerId === actorId;
}
