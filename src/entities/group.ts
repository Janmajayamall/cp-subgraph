import { Address } from "@graphprotocol/graph-ts";
import { Group } from "../../generated/schema";
import { Group as GroupContract } from "../../generated/Group/Group";
import { convertBigIntToDecimal } from "../helpers";

export function loadGroup(groupAddress: Address): Group {
	var group = Group.load(groupAddress.toHex());
	if (!group) {
		group = new Group(groupAddress.toHex());
	}
	return group;
}

export function updateGroup(groupAddress: Address): void {
	const group = loadGroup(groupAddress);

	const groupContract = GroupContract.bind(groupAddress);

	group.cToken = groupContract.cToken();
	group.manager = groupContract.manager();
	group.fee = convertBigIntToDecimal(groupContract.fee());

	group.save();
}
