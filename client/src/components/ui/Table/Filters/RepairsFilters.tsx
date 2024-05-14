import {DatePicker} from '@/components/DatePicker/DatePicker';
import {DateSubjectType, RepairsData} from '@/utils/const';
import {RepairsPageContext, useRepairsPageContext} from '@/utils/context/RepairsPageContext';
import {
	Button,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Spacer,
	Tag,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import React, {useContext} from 'react';
import {BiChevronDown, BiFilter} from 'react-icons/bi';
import {FaSearch} from 'react-icons/fa';

export type RepairsFilterHandlers = {
	handleSearchChange: (text: string) => void;
	handleCategoryChange: (category?: string) => void;
	handleActionByChange: (actionBy?: string) => void;
	handleStatusChange: (status?: string) => void;
	handleRegionChange: (region?: string) => void;
	handleOpenDateChange: (dateSubject: DateSubjectType, date: Date) => void;
	handleCloseDateChange: (dateSubject: DateSubjectType, date: Date) => void;
	handleClear: () => void;
};

type FilterModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

const FilterModal: React.FC<FilterModalProps> = ({isOpen, onClose}) => {
	const repairsPageContext = useContext(RepairsPageContext);
	const {
		data,
		openDateState,
		closeDateState,
		actionByState,
		handleOpenDateChange,
		handleCloseDateChange,
		handleActionByChange
	} = repairsPageContext as ReturnType<typeof useRepairsPageContext>;
	const [openDate, setOpenDate] = openDateState;
	const [closeDate, setCloseDate] = closeDateState;
	const [actionBy, setActionBy] = actionByState;

	const actionBys = (data as RepairsData[])
		.map((record) => record.action_by!)
		.filter((ab, i, arr) => ab && arr.indexOf(ab) === i);

	return (
		<Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside' closeOnOverlayClick={false}>
			<ModalOverlay />
			<ModalContent maxWidth={'50%'} height={'80%'} paddingY={10}>
				<ModalCloseButton />
				<ModalBody>
					<VStack width={'100%'} spacing={5}>
						<VStack flexDirection={'column'} justifyContent={'center'}>
							<VStack align={'flex-start'} spacing={1}>
								<Flex>
									<Tag justifySelf={'center'}>Case open date</Tag>
								</Flex>
								<HStack marginY={2}>
									<DatePicker
										date={openDate.from}
										onSelectedDateChanged={(date) => {
											setOpenDate(() => {
												const openDate = {from: date, to: date};
												handleOpenDateChange(openDate);
												return openDate;
											});
										}}
									/>
									<Spacer />
									<DatePicker
										date={openDate.to}
										minDate={openDate.from}
										onSelectedDateChanged={(date) => {
											setOpenDate((prev) => {
												const openDate = {...prev, to: date};
												handleOpenDateChange(openDate);
												return openDate;
											});
										}}
									/>
								</HStack>
							</VStack>
							<VStack align={'flex-start'} spacing={1}>
								<Flex>
									<Tag justifySelf={'center'}>Case close date</Tag>
								</Flex>
								<HStack marginY={2}>
									<DatePicker
										date={closeDate.from}
										onSelectedDateChanged={(date) => {
											setCloseDate(() => {
												const closeDate = {from: date, to: date};
												handleCloseDateChange(closeDate);
												return closeDate;
											});
										}}
									/>
									<Spacer />
									<DatePicker
										date={closeDate.to}
										minDate={closeDate.from}
										onSelectedDateChanged={(date) => {
											setCloseDate((prev) => {
												const closeDate = {...prev, to: date};
												handleCloseDateChange(closeDate);
												return closeDate;
											});
										}}
									/>
								</HStack>
							</VStack>
							<VStack width={'100%'} align={'flex-start'} spacing={3}>
								<Flex>
									<Tag justifySelf={'center'}>Action by</Tag>
								</Flex>
								{/* Category menu */}
								<Menu>
									<MenuButton
										isDisabled={!actionBys.length}
										as={Button}
										rightIcon={<BiChevronDown />}
									>
										{actionBy || 'Action By'}
									</MenuButton>
									<MenuList>
										{actionBys.map(
											(ab) =>
												ab && (
													<MenuItem
														key={ab}
														onClick={() => {
															setActionBy(ab);
															handleActionByChange(ab);
														}}
													>
														{ab}
													</MenuItem>
												)
										)}
									</MenuList>
								</Menu>
							</VStack>
						</VStack>
					</VStack>
				</ModalBody>
				<ModalFooter justifyContent={'center'} pb={0} pt={5}>
					<Button onClick={onClose}>Apply</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export const RepairFilters: React.FC = () => {
	const repairsPageContext = useContext(RepairsPageContext);
	const {
		data,
		searchTextState,
		categoryState,
		statusState,
		regionState,
		handleClearFilters,
		handleClearData,
		handleCategoryChange,
		handleRegionChange,
		handleStatusChange,
		handleSearchChange
	} = repairsPageContext as ReturnType<typeof useRepairsPageContext>;
	const [searchText, setSearchText] = searchTextState;
	const [category, setCategory] = categoryState;
	const [status, setStatus] = statusState;
	const [region, setRegion] = regionState;
	const {isOpen, onOpen, onClose} = useDisclosure();

	const categories = (data as RepairsData[])
		.map((record) => record.subcategory!)
		.filter((cat, i, arr) => cat && arr.indexOf(cat) === i);
	const statuses = (data as RepairsData[])
		.map((record) => record.status!)
		.filter((stat, i, arr) => stat && arr.indexOf(stat) === i);
	const regions = (data as RepairsData[])
		.map((record) => record.region!)
		.filter((region, i, arr) => region && arr.indexOf(region) === i);

	const onClear = () => {
		handleClearFilters();
		handleClearData();
	};

	return (
		<>
			{/* Search bar */}
			<InputGroup width={'30%'} minWidth={'15em'}>
				<InputLeftElement>
					<FaSearch />
				</InputLeftElement>
				<Input
					value={searchText}
					placeholder='Search...'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setSearchText(e.target.value);
						handleSearchChange(e.target.value);
					}}
				/>
			</InputGroup>
			{/* Category menu */}
			<Menu>
				<MenuButton isDisabled={!categories.length} as={Button} rightIcon={<BiChevronDown />}>
					{category || 'Category'}
				</MenuButton>
				<MenuList>
					{categories.map(
						(cat) =>
							cat && (
								<MenuItem
									key={cat}
									onClick={() => {
										setCategory(cat!);
										handleCategoryChange(cat);
									}}
								>
									{cat}
								</MenuItem>
							)
					)}
				</MenuList>
			</Menu>
			{/* Status menu */}
			<Menu>
				<MenuButton isDisabled={!statuses.length} as={Button} rightIcon={<BiChevronDown />}>
					{status || 'Status'}
				</MenuButton>
				<MenuList>
					{statuses.map(
						(stat) =>
							stat && (
								<MenuItem
									key={stat}
									onClick={() => {
										setStatus(stat);
										handleStatusChange(stat);
									}}
								>
									{stat}
								</MenuItem>
							)
					)}
				</MenuList>
			</Menu>
			{/* Region menu */}
			<Menu>
				<MenuButton isDisabled={!regions.length} as={Button} rightIcon={<BiChevronDown />}>
					{region || 'Region'}
				</MenuButton>
				<MenuList>
					{regions.map(
						(region) =>
							region && (
								<MenuItem
									key={region}
									onClick={() => {
										setRegion(region);
										handleRegionChange(region);
									}}
								>
									{region}
								</MenuItem>
							)
					)}
				</MenuList>
			</Menu>
			{/*Other Filters */}
			<Button leftIcon={<BiFilter />} onClick={onOpen}>
				Other Filters
			</Button>
			<Button variant={'secondary'} onClick={onClear}>
				Clear
			</Button>
			<FilterModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};
