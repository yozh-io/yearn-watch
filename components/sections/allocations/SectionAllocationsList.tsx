import	React, {ReactElement}	from	'react';
import	{List}								from	'@yearn-finance/web-lib/layouts';
import	{Card}						from	'@yearn-finance/web-lib/components';
import	* as utils							from	'@yearn-finance/web-lib/utils';

const	ProtocolBox = React.memo(function ProtocolBox({protocol}: {protocol: any}): ReactElement {
	function	renderSummary(p: {open: boolean}): ReactElement {
		return (
			<div className={`rounded-default relative grid h-20 w-[965px] grid-cols-22 bg-neutral-0 py-4 px-6 transition-colors md:w-full ${p.open ? '' : 'hover:bg-neutral-100'}`}>
				<div className={'min-w-32 col-span-8 flex flex-row items-center'}>
					<div className={'text-neutral-500'}>
						<div className={'flex-row-center'}>
							<div>
								<b>{protocol.name}</b>
								<p className={'text-xs text-neutral-500'}>
									{protocol.strategiesAmount > 1 ? `${protocol.strategiesAmount} strats` : `${protocol.strategiesAmount} strat`}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center tabular-nums'}>
					<div>
						<b>{`${utils.format.amount(protocol.tvl, 2)}$`}</b>
						<p className={'text-sm'}>{`${utils.format.amount(protocol.totalDebtRatio, 2)}%`}</p>
					</div>
				</div>
				<div className={'min-w-36 cell-end col-span-5 flex flex-row items-center tabular-nums'}>
					<div>
						{protocol.strategiesAmount}
					</div>
				</div>
				{/*<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center'}>*/}
				{/*	<Link passHref href={`/query${group.urlParams}`}>*/}
				{/*		<Button*/}
				{/*			onClick={(e: MouseEvent): void => e.stopPropagation()}*/}
				{/*			as={'a'}*/}
				{/*			variant={'light'}*/}
				{/*			className={'min-w-fit px-5'}>*/}
				{/*			<span className={'sr-only'}>{'Access details about this strategy'}</span>*/}
				{/*			{'Details'}*/}
				{/*		</Button>*/}
				{/*	</Link>*/}
				{/*	<div className={'ml-2'}>*/}
				{/*		<Chevron*/}
				{/*			className={`h-6 w-6 text-accent-500 transition-transform ${p.open ? '-rotate-90' : '-rotate-180'}`} />*/}
				{/*	</div>*/}
				{/*</div>*/}
			</div>
		);
	}

	return (
		<Card.Detail summary={(p: unknown): ReactElement => renderSummary(p as {open: boolean})}>
			<div></div>
			{/*<div className={'mt-10'}>*/}
			{/*	{*/}
			{/*		group.strategies*/}
			{/*			.sort((a, b): number => (a.index || 0) - (b.index || 0))*/}
			{/*			.map((strategy, index: number): ReactElement => (*/}
			{/*				<StrategyBox*/}
			{/*					key={index}*/}
			{/*					strategy={strategy}*/}
			{/*					symbol={strategy.vault.name}*/}
			{/*					decimals={strategy.vault.decimals || 18}*/}
			{/*					vaultAddress={strategy.vault.address}*/}
			{/*					vaultExplorer={strategy.vault.explorer} />*/}
			{/*			))*/}
			{/*	}*/}
			{/*</div>*/}
		</Card.Detail>
	);
});

type		TSectionAllocationsList = {
	sortBy: string,
	protocols: any,
};
const	SectionAllocationsList = React.memo(function SectionAllocationsList({sortBy, protocols}: TSectionAllocationsList): ReactElement {
	const	[sortedProtocols, set_sortedProtocols] = React.useState([] as (any)[]);
	let _protocols;
	React.useEffect((): void => {
		console.log('received', protocols);
		if(protocols['list']){
		const protocolList = Object.keys(protocols['list']).map((protocol)=>protocols.list[protocol]);
		if (['tvl', '-tvl'].includes(sortBy)) {
			_protocols = protocolList.sort((a, b): number => {
				if (sortBy === '-tvl')
					return a.tvl - b.tvl;
				return b.tvl - a.tvl;
			});
		} else if (['name', '-name'].includes(sortBy)) {
			_protocols = protocolList.sort((a, b): number => {
				const	aName = a.name || '';
				const	bName = b.name || '';
				if (sortBy === '-name')
					return aName.localeCompare(bName);
				return bName.localeCompare(aName);
			});
		} else if (['strategiesAmount', '-strategiesAmount', ''].includes(sortBy)) {
			_protocols = protocolList.sort((a, b): number => {
				if (sortBy === '-strategiesAmount')
					return a.strategiesAmount - b.strategiesAmount;
				return b.strategiesAmount - a.strategiesAmount;
			});
		}
		set_sortedProtocols(_protocols);
		}
	}, [protocols, sortBy]);

	return (
		<List className={'flex w-full flex-col space-y-2'}>
			{sortedProtocols.map((protocol, index): ReactElement => <span key={protocol.name + index}>
				<ProtocolBox protocol={protocol}/>
			</span>)}
		</List>
	);
});

export default SectionAllocationsList;