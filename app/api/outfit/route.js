import { buildOutfit } from '@/ai/buildOutfit';
import { matchSlots } from '@/db/matchSlots';

export async function POST(request) {
  const { listingId, userId } = await request.json();

  if (!listingId) {
    return Response.json({ error: 'listingId is required' }, { status: 400 });
  }

  try {
    const outfitPlan = await buildOutfit({ id: listingId });
    const slots = await matchSlots(outfitPlan);
    return Response.json({ slots });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}