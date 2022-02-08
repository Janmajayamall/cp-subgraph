import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import {
	convertAddressBytesToAddress,
	convertBigIntToDecimal,
	FOUR_BI,
	ONE_BI,
	ZERO_BI,
	TWO_BI,
	ZERO_BD,
	ONE_BD,
} from "../helpers";
import { Group as GroupContract } from "../../generated/Group/Group";

/**
 * Update functions
 */
export function loadMarket(marketIdentifier: Bytes): Market {
	var market = Market.load(marketIdentifier.toHex());
	if (!market) {
		market = new Market(marketIdentifier.toHex());
	}

	return market;
}

export function updateMarketLiquiditySupply(marketIdentifier: Bytes): void {
	const market = loadMarket(marketIdentifier);

	// group contract instance
	const groupContract = GroupContract.bind(
		Address.fromHexString(market.group)
	);

	market.liquiditySupply = convertBigIntToDecimal(
		groupContract.liquiditySupply(marketIdentifier)
	);

	market.save();
}

export function updateMarketOutcomeFractions(marketIdentifier: Bytes): void {
	const market = loadMarket(marketIdentifier);

	// group contract instance
	const groupContract = GroupContract.bind(
		Address.fromHexString(market.group)
	);

	// create outcome fractions
	const outcomeFractions = new Array<BigDecimal>(2);
	const outcomeDenominator = convertBigIntToDecimal(
		groupContract.outcomeDenominators(marketIdentifier),
		ONE_BD
	);
	outcomeFractions[0] = convertBigIntToDecimal(
		groupContract.outcomeNumerators(marketIdentifier, ZERO_BI),
		ONE_BD
	).div(outcomeDenominator);
	outcomeFractions[1] = convertBigIntToDecimal(
		groupContract.outcomeNumerators(marketIdentifier, ONE_BI),
		ONE_BD
	).div(outcomeDenominator);

	market.outcomeFractions = outcomeFractions;
	market.save();
}

export function updateMarketReserves(marketIdentifier: Bytes) {
	const market = loadMarket(marketIdentifier);

	// group contract instance
	const groupContract = GroupContract.bind(
		Address.fromHexString(market.group)
	);

	const marketReserves = groupContract.marketReserves(marketIdentifier);
	market.reserve0 = convertBigIntToDecimal(marketReserves.value0);
	market.reserve1 = convertBigIntToDecimal(marketReserves.value1);

	market.save();
}

export function updateMarketDetails(
	marketIdentifier: Bytes,
	groupAddress: Address,
	timestamp: BigInt
): void {
	const market = loadMarket(marketIdentifier);

	// group contract instance
	const groupContract = GroupContract.bind(groupAddress);

	// update basic details
	market.marketIdentifier = marketIdentifier;
	market.cToken = groupContract.cToken();
	market.fee = convertBigIntToDecimal(groupContract.fee());
	market.manager = groupContract.manager();
	market.group = groupAddress.toHex();

	// update token ids
	const tokenIds = groupContract.getOutcomeTokenIds(marketIdentifier);
	market.tokenId0 = tokenIds.value0;
	market.tokenId1 = tokenIds.value1;

	market.timestamp = timestamp;

	market.save();
}

export function increaseTradeVolume(
	marketIdentifier: Bytes,
	by: BigInt,
	timestamp: BigInt
): void {
	const market = loadMarket(marketIdentifier);
	market.tradeVolume = market.tradeVolume.plus(convertBigIntToDecimal(by));
	market.lastActionTimestamp = timestamp;
	market.save();
}

export function increaseTradesCount(marketIdentifier: Bytes, by: BigInt): void {
	const market = loadMarket(marketIdentifier);
	market.tradesCount = market.tradesCount.plus(by);
	market.save();
}
