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
	increaseTradesCount,
	increaseTradeVolume,
	updateUser,
	updateUserMarket,
	updateMarketDetails,
	updateMarketLiquiditySupply,
	updateMarketOutcomeFractions,
	updateMarketReserves,
	increaseUserTotalRedeemAmount,
} from "../entities";
import { loadGroup, updateGroup } from "../entities/group";
import { updateLiquidityPosition } from "../entities/liquidityPosition";
import { updateSharesPosition } from "../entities/sharesPosition";
import { ONE_BI } from "../helpers";

export function handleLiquidityAdded(event: LiquidityAdded) {
	var group = loadGroup(event.address);
	if (group.manager == Bytes.empty()) {
		// group hasn't been set before
		updateGroup(event.address);
	}

	// save user interaction
	updateUser(event.params.by);
	updateUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

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
export function handleLiquidityRemoved(event: LiquidityRemoved) {
	// save user interaction
	updateUser(event.params.by);
	updateUserMarket(
		event.params.by,
		event.params.marketIdentifier,
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

export function handleSharesBought(event: SharesBought) {
	// save user interaction
	updateUser(event.params.by);
	updateUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update user's shares position
	updateSharesPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	// update market reserves
	updateMarketReserves(event.params.marketIdentifier);

	// update market trade volume
	increaseTradeVolume(
		event.params.marketIdentifier,
		event.params.amount,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);
}

export function handleSharesSold(event: SharesSold) {
	// save user interaction
	updateUser(event.params.by);
	updateUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update user's shares position
	updateSharesPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	// update market reserves
	updateMarketReserves(event.params.marketIdentifier);

	// update market trade volume
	increaseTradeVolume(
		event.params.marketIdentifier,
		event.params.amount,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);
}

export function handleSharesMerged(event: SharesMerged) {
	// save user interaction
	updateUser(event.params.by);
	updateUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update reserves
	updateMarketReserves(event.params.marketIdentifier);

	// update user's shares positions
	updateSharesPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);
}

export function handleSharesRedeemed(event: SharesRedeemed) {
	// save user interaction
	updateUser(event.params.by);
	updateUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update market reserves
	updateMarketReserves(event.params.marketIdentifier);

	// update user's shares positions
	updateSharesPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	// update user's total redeem amount
	increaseUserTotalRedeemAmount(event.params.by, event.params.amount);
}

export function handleOutcomeSet(event: OutcomeSet) {
	updateMarketOutcomeFractions(event.params.marketIdentifier);
}
