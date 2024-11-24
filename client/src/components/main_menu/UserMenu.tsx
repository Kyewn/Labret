import {UserDebtModal} from '@/components/main_menu/UserDebtModal';
import {UserProfileModal} from '@/components/main_menu/UserProfileModal';
import {LargeIconButton} from '@/components/ui/LargeIconButton';
import {getAllRecords} from '@/db/record';
import {useAppContext} from '@/utils/context/AppContext';
import {RentalRecord, User} from '@/utils/data';
import {paths} from '@/utils/paths';
import {
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Spacer,
	Tag,
	TagLabel,
	Text,
	VStack,
	useColorMode,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import {addDays} from 'date-fns';
import {
	BadgeCheck,
	Combine,
	FlaskConical,
	Moon,
	PackageCheck,
	PackagePlus,
	ScanFace,
	Skull,
	Sun,
	User2
} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export const UserMenu = () => {
	const navigate = useNavigate();
	const {colorMode} = useColorMode();
	const {appState, appDispatch} = useAppContext();
	const toast = useToast();
	const {user, handleCloseExistingPeerConnection} = appState;
	const profileDisclosure = useDisclosure();
	const debtDisclosure = useDisclosure();
	const {onOpen} = profileDisclosure;
	const {onOpen: onDebtOpen} = debtDisclosure;

	const [noOfUnpaidDebts, setNoOfUnpaidDebts] = useState<number>(0);

	const getNoOfUnpaidDebts = (records: RentalRecord[]) => {
		const unpaidRecordsLength = records.filter(
			(record) =>
				(record.renter as User).id == user?.id &&
				(((record.returnedAt as Date) > addDays(record.expectedReturnAt as Date, 1) &&
					record.recordStatus != 'completed' &&
					record.recordStatus != 'paid') ||
					record.recordStatus === 'rent_rejected' ||
					record.recordStatus === 'return_rejected')
		).length;
		setNoOfUnpaidDebts(unpaidRecordsLength);
	};

	const getUserTypeColor = (type: string) => {
		switch (type) {
			case 'user':
				return 'green';
			case 'admin':
				return 'blue';
		}
	};
	const getUserTypeLabel = (type: string) => {
		switch (type) {
			case 'user':
				return 'User';
			case 'admin':
				return 'Admin';
		}
	};

	useEffect(() => {
		const handleInit = async () => {
			const records = await getAllRecords();
			getNoOfUnpaidDebts(records);
		};
		if (user?.type === 'user') {
			handleInit();
		}
	}, [user]);

	const handleRentClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.main.rent);
	};

	const handleReturnClick = async () => {
		const records = await getAllRecords();
		const userRents = records.filter(
			(record) => (record.renter as User).id == user?.id && record.recordStatus == 'active'
		);

		if (!userRents.length) {
			toast({
				title: 'No records found',
				description: "You don't have any verified rent records to return at the moment.",
				status: 'info',
				duration: 3000,
				isClosable: true
			});
			return;
		}
		handleCloseExistingPeerConnection();
		navigate(paths.main.return);
	};

	const handleRentalHistoryClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.sub.userHistory);
	};

	const handleVerifyAddRental = async () => {
		const records = await getAllRecords();
		const activeUserRecords = records.filter(
			(record) =>
				(record.renter as User).id == user?.id &&
				record.recordStatus != 'completed' &&
				record.recordStatus != 'paid' &&
				record.recordStatus != 'rent_rejected' &&
				record.recordStatus != 'return_rejected'
		);
		const userDebtRecords = records.filter(
			(record) =>
				(record.renter as User).id == user?.id &&
				(((record.returnedAt as Date) > addDays(record.expectedReturnAt as Date, 1) &&
					record.recordStatus != 'completed' &&
					record.recordStatus != 'paid') ||
					record.recordStatus === 'rent_rejected' ||
					record.recordStatus === 'return_rejected')
		);

		// Check user not having 3 pending/rent status records
		// Check user not having 3 debt records
		if (activeUserRecords.length >= 3) {
			toast({
				title: 'Rental limit exceeded',
				description:
					'You have exceeded the maximum limit of 3 records, please complete them first before adding a new record.',
				status: 'warning',
				duration: 3000,
				isClosable: true
			});
			return;
		} else if (userDebtRecords.length >= 3) {
			toast({
				title: 'Debt limit exceeded',
				description:
					'You are still indebted for 3 or more records, please settle them first before adding a new record.',
				status: 'warning',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		handleRentClick();
	};

	const handleVerificationClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.sub.verifications);
	};
	const handleManageItemsClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.sub.items);
	};
	const handleSettleDebtsClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.sub.debts);
	};

	const handleLogout = () => {
		appDispatch({type: 'SET_USER', payload: null});
		// main menu camera needs to be rerendered everytime user logs out
		navigate(0);
	};

	return (
		<>
			<UserProfileModal disclosure={profileDisclosure} />
			{user?.type === 'user' && <UserDebtModal disclosure={debtDisclosure} />}
			<Flex flexDirection={'column'} flex={0.7} overflowX={'hidden'} overflowY={'auto'}>
				<VStack alignItems={'flex-start'}>
					<Button
						variant={'criticalOutline'}
						alignSelf={'flex-end'}
						leftIcon={<ScanFace />}
						onClick={handleLogout}
					>
						Logout
					</Button>
					<HStack>
						<Text fontWeight={'700'} color={'lrBrown.700'}>
							Hi,
						</Text>
						<Box display={'inline-block'}>{colorMode == 'dark' ? <Moon /> : <Sun />}</Box>
					</HStack>
					<Flex width={'100%'} alignItems={'center'}>
						<VStack alignItems={'flex-start'}>
							<Heading size={'lg'} maxW={'14em'} overflow={'hidden'}>
								{user?.name}
							</Heading>
						</VStack>
						<Spacer />
						<HStack>
							<Tag size={'lg'} colorScheme={getUserTypeColor(user?.type || 'user')}>
								{getUserTypeLabel(user?.type || 'user')}
							</Tag>
							<Button variant={'outline'} leftIcon={<User2 />} onClick={onOpen}>
								View Profile
							</Button>
						</HStack>
					</Flex>

					<HStack justifyContent={'flex-start'} paddingY={5} width={'100%'}>
						{
							/* TODO If user type */
							user?.type === 'user' && (
								<>
									<LargeIconButton
										icon={PackagePlus}
										iconW={10}
										iconH={10}
										onClick={handleVerifyAddRental}
										label='Add Rental'
										variant='solid'
									/>
									<LargeIconButton
										icon={PackageCheck}
										iconW={10}
										iconH={10}
										onClick={handleReturnClick}
										label='Return Equipment'
										variant='outline'
									/>
									<LargeIconButton
										icon={Combine}
										iconW={10}
										iconH={10}
										onClick={handleRentalHistoryClick}
										label='User History'
										variant='outline'
									/>
								</>
							)
						}
						{
							/* admin type  */
							user?.type === 'admin' && (
								<>
									<LargeIconButton
										icon={BadgeCheck}
										iconW={10}
										iconH={10}
										onClick={handleVerificationClick}
										label='Verifications'
										variant='solid'
									/>
									<LargeIconButton
										icon={FlaskConical}
										iconW={10}
										iconH={10}
										onClick={handleManageItemsClick}
										label='Manage Items'
										variant='outline'
									/>
									<LargeIconButton
										icon={Skull}
										iconW={10}
										iconH={10}
										onClick={handleSettleDebtsClick}
										label='Track Debts'
										variant='outline'
									/>
								</>
							)
						}
					</HStack>
					{user?.type === 'user' && (
						<Box position={'relative'}>
							<Button variant={'outline'} onClick={onDebtOpen}>
								Debts
							</Button>
							{!!noOfUnpaidDebts && (
								<Tag
									position={'absolute'}
									size={'sm'}
									outline={'none'}
									border={'none'}
									backgroundColor='lrRed.200'
									paddingY={1}
									borderRadius={'50%'}
									right={'-0.5rem'}
									top={'-0.5rem'}
								>
									<TagLabel color='whiteDarkMode' fontWeight={700}>
										{noOfUnpaidDebts}
									</TagLabel>
								</Tag>
							)}
						</Box>
					)}
				</VStack>
			</Flex>
		</>
	);
};
