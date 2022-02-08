import { Address, BigInt } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";

/**
 * Update functions
 */
export function loadUser(userAddress: Address): User {
	const id = userAddress.toHex();
	var user = User.load(id);
	if (!user) {
		user = new User(id);
	}
	return user;
}

export function updateUser(userAddress: Address): void {
	const user = loadUser(userAddress);
	user.save();
}

export function increaseUserTotalRedeemAmount(
	userAddress: Address,
	by: BigInt
): void {
	const user = loadUser(userAddress);
	user.totalRedeemAmount = user.totalRedeemAmount.plus(
		convertBigIntToDecimal(by)
	);
	user.save();
}
