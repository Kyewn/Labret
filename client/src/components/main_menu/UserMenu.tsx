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
	Text,
	VStack,
	useColorMode,
	useToast
} from '@chakra-ui/react';
import {Combine, HandCoins, Moon, PackageCheck, PackagePlus, ScanFace, Sun} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export const UserMenu = () => {
	const navigate = useNavigate();
	const {colorMode} = useColorMode();
	const {appState, appDispatch} = useAppContext();
	const {
		handleOpenExistingPeerConnection,
		handleCloseExistingPeerConnection,
		handleCloseNormalCamera
	} = appState;
	const [hasUserRecords, setHasUserRecords] = useState<boolean>(false);
	const toast = useToast();

	const getUserTypeColor = (type: string) => {
		switch (type) {
			case 'user':
				return 'green';
			case 'admin':
				return 'blue';
		}
	};

	const checkIfHasUserRecords: () => boolean = () => {
		// TODO get user records
		// TODO return false if no records to return
		return true;
	};

	useEffect(() => {
		setHasUserRecords(checkIfHasUserRecords());
	}, []);

	const handleRentClick = () => {
		handleCloseExistingPeerConnection();
		appDispatch({type: 'SET_VIDEO_MODE', payload: 'item'});
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
		appDispatch({type: 'SET_VIDEO_MODE', payload: 'item'});
		navigate(paths.main.return);
	};

	const handleRentalHistoryClick = () => {
		handleCloseExistingPeerConnection();
		navigate(paths.sub.userHistory);
	};

	const handleLogout = () => {
		appDispatch({type: 'SET_USER', payload: null});
		handleCloseNormalCamera();
		handleOpenExistingPeerConnection();
	};

	return (
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
					{/* TODO: Replace with user name*/}
					<VStack alignItems={'flex-start'}>
						<Heading size={'lg'} maxW={'14em'} overflow={'hidden'}>
							Brian
						</Heading>
						<Text fontSize={'sm'} p={0}>
							Balance: 0
						</Text>
					</VStack>
					<Spacer />
					<HStack>
						<Tag size={'lg'} colorScheme={getUserTypeColor('user')}>
							User
						</Tag>
						<Button variant={'outline'} leftIcon={<HandCoins />}>
							Top Up
						</Button>
					</HStack>
				</Flex>
				<HStack justifyContent={'flex-start'} paddingY={5} width={'100%'}>
					{/* TODO If user type */}
					<LargeIconButton
						icon={PackagePlus}
						iconW={10}
						iconH={10}
						onClick={handleRentClick}
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
			</VStack>
		</Flex>
	);
};
