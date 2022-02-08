import { Address, Bytes } from "@graphprotocol/graph-ts";
import { LiquidityPosition } from "../../generated/schema";
import { Group as GroupContract } from "../../generated/Group/Group";
import { convertBigIntToDecimal } from "../helpers";

/**
 * Update functions
 */
export function loadLiquidityPosition(
	marketIdentifier: Bytes,
	userAddress: Address
): LiquidityPosition {
	const id = marketIdentifier + "-" + userAddress.toHex();
	var liquidityPosition = LiquidityPosition.load(id);
	if (!liquidityPosition) {
		liquidityPosition = new LiquidityPosition(id);
		liquidityPosition.user = userAddress.toHex();
		liquidityPosition.market = marketIdentifier.toHex();
	}
	return liquidityPosition;
}

export function updateLiquidityPosition(
	userAddress: Address,
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const liquidityPosition = loadLiquidityPosition(
		marketIdentifier,
		userAddress
	);

	// group contract instance
	const groupContract = GroupContract.bind(groupAddress);

	// update liquidity id
	liquidityPosition.liquidityId = groupContract.getLiquidityId(
		marketIdentifier,
		userAddress
	);

	// update liquidity position
	liquidityPosition.liquidityShares = convertBigIntToDecimal(
		groupContract.liquidity(liquidityPosition.liquidityId)
	);
	liquidityPosition.liquiditySupply = convertBigIntToDecimal(
		groupContract.liquiditySupply(marketIdentifier)
	);

	liquidityPosition.save();
}
