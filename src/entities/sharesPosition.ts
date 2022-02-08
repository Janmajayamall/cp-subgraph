import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { SharesPosition } from "../../generated/schema";
import { Group as GroupContract } from "../../generated/Group/Group";
import { convertBigIntToDecimal } from "../helpers";

/**
 * Update functions
 */
export function loadSharesPosition(
	userAddress: Address,
	marketIdentifier: Bytes
): SharesPosition {
	const id = userAddress.toHex() + "-" + marketIdentifier.toHex();
	var sharesPosition = SharesPosition.load(id);
	if (!sharesPosition) {
		sharesPosition = new SharesPosition(id);
		sharesPosition.user = userAddress.toHex();
		sharesPosition.market = marketIdentifier.toHex();
	}
	return sharesPosition;
}

export function updateSharesPosition(
	userAddress: Address,
	marketIdentifier: Bytes,
	groupAddress: Address,
	timestamp: BigInt
): void {
	const sharesPosition = loadSharesPosition(userAddress, marketIdentifier);

	// group contract instance
	const groupContract = GroupContract.bind(groupAddress);

	const tokenIds = groupContract.getOutcomeTokenIds(marketIdentifier);
	sharesPosition.amount0 = convertBigIntToDecimal(
		groupContract.balanceOf(userAddress, tokenIds.value0)
	);
	sharesPosition.amount1 = convertBigIntToDecimal(
		groupContract.balanceOf(userAddress, tokenIds.value1)
	);

	sharesPosition.timestamp = timestamp;

	sharesPosition.save();
}
