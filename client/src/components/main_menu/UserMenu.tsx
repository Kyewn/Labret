import {UserProfileModal} from '@/components/main_menu/UserProfileModal';
import {LargeIconButton} from '@/components/ui/LargeIconButton';
import {useAppContext} from '@/utils/context/AppContext';
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
import {Combine, Moon, PackageCheck, PackagePlus, ScanFace, Sun, User2} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export const UserMenu = () => {
	const navigate = useNavigate();
	const {colorMode} = useColorMode();
	const {appState, appDispatch} = useAppContext();
	const toast = useToast();
	const {user, handleCloseExistingPeerConnection} = appState;
	const [hasUserRecords, setHasUserRecords] = useState<boolean>(false);
	const profileDisclosure = useDisclosure();
	const {onOpen} = profileDisclosure;

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

	const checkIfHasUserRecords: () => boolean = () => {
		// TODO get user records
		// TODO return false if no records to return
		return true;
	};

	useEffect(() => {
		const checkUserRecords = async () => {
			const mHasUserRecords = await checkIfHasUserRecords();
			setHasUserRecords(mHasUserRecords);
		};
		checkUserRecords();
	}, []);

	const handleRentClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.main.rent);
	};

	const handleReturnClick = () => {
		if (!hasUserRecords) {
			toast({
				title: 'No records found',
				description: 'User does not have any records to return.',
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

	const handleVerifyAddRental = () => {
		// FIXME:
		// - Check user not having 3 pending/rent status records
		// - Check user not having 3 debt records

		handleRentClick();
	};

	const handleLogout = () => {
		appDispatch({type: 'SET_USER', payload: null});
	};

	return (
		<>
			<UserProfileModal disclosure={profileDisclosure} />
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
						{/* TODO If user type */}
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
						{/* TODO If admin type  */}
						{/* <LargeIconButton
						icon={BadgeCheck}
						iconW={10}
						iconH={10}
						onClick={() => {}}
						label='Make Verifications'
						variant='solid'
					/>
					<LargeIconButton
						icon={FlaskConical}
						iconW={10}
						iconH={10}
						onClick={() => {}}
						label='View Equipment'
						variant='outline'
					/>
					<LargeIconButton
						icon={Skull}
						iconW={10}
						iconH={10}
						onClick={() => {}}
						label='Critical records'
						variant='outline'
					/> */}
					</HStack>

					<Box position={'relative'}>
						<Button variant={'outline'}>Debts</Button>
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
								{/* {FIXME: Change to unpaid records count} */}3
							</TagLabel>
						</Tag>
					</Box>
				</VStack>
			</Flex>
		</>
	);
};
