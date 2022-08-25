import	React, {ReactElement} 		from	'react';
import	{useWeb3}					from	'@yearn-finance/web-lib/contexts';
import	SectionAllocationsList		from	'components/sections/allocations/SectionAllocationsList';
import	{TableHead, TableHeadCell}	from	'components/TableHeadCell';
import	useWatch					from	'contexts/useWatch';
import	{TRowHead}		from	'contexts/useWatch.d';


/* 🔵 - Yearn Finance **********************************************************
** This will render the chain selector for table. This component asks for
*  sortBy and set_sortBy in order to handle the chevron displays and to set
** the sort based on the user's choice.
******************************************************************************/
function	NetworkSelector({selectedChain, chainList, set_chain}:
								{
									selectedChain: string,
									chainList: string[],
									set_chain: React.Dispatch<React.SetStateAction<string>>
								}):
	ReactElement {
	return (
			<div className='min-w-32 col-span-8 gap-4 flex flex-row items-center'>
				{chainList?.map((chain, index)=>(
					<div
						key={index}
						 className={`py-2 px-4 cursor-pointer rounded-[12px] hover:bg-neutral-300 text-black-600${chain === selectedChain ? 'transition-color bg-neutral-300' : 'transition-color bg-neutral-300/50'}`}
						 onClick={()=>set_chain(chain)}
					>
						{chain}
					</div>
				))}
			</div>
	);
}


/* 🔵 - Yearn Finance **********************************************************
** This will render the head of the fake table we have, with the sortable
** elements. This component asks for sortBy and set_sortBy in order to handle
** the chevron displays and to set the sort based on the user's choice.
******************************************************************************/
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<TableHead sortBy={sortBy} set_sortBy={set_sortBy}>
			<TableHeadCell
				className={'cell-start min-w-32 col-span-6'}
				label={'Protocol'}
				sortId={'name'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-6'}
				label={'Total Value Locked'}
				sortId={'tvl'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-7'}
				label={'Strategies amount'}
				sortId={'strategiesAmount'} />
		</TableHead>
	);
}

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Risk page
******************************************************************************/
function	Allocations(): ReactElement {
	const initProtocolState = {
		All: {
			list: {}
		}
	};
	const	{chainID} = useWeb3();
	const	{dataChainID, dataByChain} = useWatch();
	const	[sortBy, set_sortBy] = React.useState('tvl');
	const	[selectedChain, set_chain] = React.useState('All');
	const	[protocols, set_protocols] = React.useState<any>(initProtocolState);
	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** It also takes into account the router query arguments as additional
	** filters.
	**************************************************************************/


	React.useEffect((): void => {
		if (dataChainID !== chainID || dataByChain === []) {
			set_protocols(initProtocolState);
			return;
		}
		const protocols = {};
		protocols['All'] = {
			tvlTotal: 0,
			list: {}
		};
		let totalVaults = 0;
		dataByChain.forEach((chainData)=>{
			protocols[chainData.name] = {
				tvlTotal: 0,
				list: {}
			};
			chainData.vaults.forEach((vault)=>{
				vault.strategies.forEach((strategy)=> {
					if (strategy.protocols) {
					strategy.protocols.forEach((protocol) => {
						if (!protocols[chainData.name]['list'][protocol]) {
							protocols[chainData.name]['list'][protocol] = {
								strategiesTVL: {},
								tvl: 0,
								name: protocol,
							};
						}
						protocols[chainData.name]['list'][protocol].tvl += strategy.totalDebtUSDC;
						if(!protocols[chainData.name]['list'][protocol].strategiesTVL[strategy.name]){
							protocols[chainData.name]['list'][protocol].strategiesTVL[strategy.name] = 0
						}
						protocols[chainData.name]['list'][protocol].strategiesTVL[strategy.name] += strategy.totalDebtUSDC;
						protocols[chainData.name]['tvlTotal'] += strategy.totalDebtUSDC;

						if (!protocols['All']['list'][protocol]) {
							protocols['All']['list'][protocol] = {
								strategiesTVL: {},
								tvl: 0,
								name: protocol,
							};
						}
						protocols['All']['list'][protocol].tvl += strategy.totalDebtUSDC;
						if(!protocols['All']['list'][protocol].strategiesTVL[strategy.name]){
							protocols['All']['list'][protocol].strategiesTVL[strategy.name] = 0
						}
						protocols['All']['list'][protocol].strategiesTVL[strategy.name] += strategy.totalDebtUSDC;
						protocols['All']['tvlTotal'] += strategy.totalDebtUSDC;
					})
					}
				})
			})
			protocols[chainData.name]['protocolsCount'] = Object.keys(protocols[chainData.name]['list']).length;
			totalVaults += chainData.vaults.length;
		})
		Object.keys(protocols).forEach((networkName)=>{
			if(protocols[networkName]['list']) {
				Object.keys(protocols[networkName]['list']).forEach((protocol) => {
					protocols[networkName]['list'][protocol].strategiesAmount = Object.keys(protocols[networkName]['list'][protocol].strategiesTVL).length
					protocols[networkName]['list'][protocol]['totalDebtRatio'] =
						protocols[networkName]['list'][protocol].tvl /
						protocols[networkName]['tvlTotal'] * 100
				})
			}
		})
		set_protocols(protocols);
	}, [dataByChain]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<NetworkSelector selectedChain={selectedChain} chainList={Object.keys(protocols)} set_chain={set_chain}/>
			<div className={'mt-10 flex h-full overflow-x-scroll pb-0'}>
				<div className={'flex h-full w-[965px] flex-col md:w-full'}>
					<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
					<SectionAllocationsList sortBy={sortBy} protocols={protocols[selectedChain]} />
				</div>
			</div>
		</div>
	);
}

export default Allocations;
