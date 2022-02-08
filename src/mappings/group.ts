import { Bytes } from "@graphprotocol/graph-ts";
import {
	LiquidityAdded,
	LiquidityRemoved,
	OutcomeSet,
	SharesBought,
	SharesMerged,
	SharesRedeemed,
	SharesSold,
} from "../../generated/Group/Group";
import {
	updateMarketDetails,
	updateMarketLiquiditySupply,
	updateMarketOutcomeFractions,
	updateMarketReserves,
} from "../entities";
import { loadGroup, updateGroup } from "../entities/group";
import { updateLiquidityPosition } from "../entities/liquidityPosition";

export function handleLiquidityAdded(event: LiquidityAdded) {
	var group = loadGroup(event.address);
	if (group.manager == Bytes.empty()) {
		// group hasn't been set before
		updateGroup(event.address);
	}

	// update the market
	updateMarketDetails(
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);
	updateMarketReserves(event.params.marketIdentifier);
	updateMarketOutcomeFractions(event.params.marketIdentifier);
	updateMarketLiquiditySupply(event.params.marketIdentifier);

	// update user's liquidity position
	updateLiquidityPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address
	);
}
export function handleLiquidityRemoved(event: LiquidityRemoved) {}
export function handleSharesBought(event: SharesBought) {}
export function handleSharesSold(event: SharesSold) {}
export function handleSharesMerged(event: SharesMerged) {}
export function handleSharesRedeemed(event: SharesRedeemed) {}
export function handleOutcomeSet(event: OutcomeSet) {}
