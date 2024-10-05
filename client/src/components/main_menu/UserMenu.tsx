import {UserDebtModal} from '@/components/main_menu/UserDebtModal';
import {UserProfileModal} from '@/components/main_menu/UserProfileModal';
import {LargeIconButton} from '@/components/ui/LargeIconButton';
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
	const [hasUserRecords, setHasUserRecords] = useState<boolean>(false);
	const profileDisclosure = useDisclosure();
	const debtDisclosure = useDisclosure();
	const {onOpen} = profileDisclosure;
	const {onOpen: onDebtOpen} = debtDisclosure;

	const [noOfUnpaidDebts, setNoOfUnpaidDebts] = useState<number>(0);

	const getNoOfUnpaidDebts = (records: RentalRecord[]) => {
		const unpaidRecordsLength = records.filter(
			(record) =>
				(record.renter as User).id == user?.id &&
				(record.recordStatus === 'rent_rejected' || record.recordStatus === 'return_rejected')
		).length;
		setNoOfUnpaidDebts(unpaidRecordsLength);
	};

	const checkIfHasReturnableRecords = (records: RentalRecord[]) => {
		// TODO get user records
		// TODO return false if no records to return
		setHasUserRecords(true);
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
			// FIXME: enable
			// const records = await getAllRecords();
			const records = dummyRecords;

			checkIfHasReturnableRecords(records);
			getNoOfUnpaidDebts(records);
		};
		handleInit();
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
	};

	return (
		<>
			<UserProfileModal disclosure={profileDisclosure} />
			<UserDebtModal disclosure={debtDisclosure} />
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
										label='Settle Debts'
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

const dummyRecords: RentalRecord[] = [
	{
		recordId: 'ABC123',
		recordTitle: 'Hello',
		renter: {
			id: 'Nng1lf8fQaXm5sejlBt5',
			name: 'asd',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-5'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Hello1',
		renter: {
			id: 'Nng1lf8fQaXm5sejlBt5',
			name: 'asd',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-5'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: '2',
		renter: {
			id: 'Nng1lf8fQaXm5sejlBt5',
			name: 'asd',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'returning',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2024-7-17'),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning1',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'returning',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning2',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'returning2',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue1',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue2',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue1',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue2',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'completed',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed1',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'completed',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed2',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'completed',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'paid',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid1',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'paid',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid2',
		renter: {
			id: 'PJtSBgLgeBtbgg5NES2Z',
			name: 'pjt',
			email: 'pjtEmail',
			status: 'pending',
			type: 'user',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		},
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123,
					createdAt: new Date(),
					createdBy: {
						id: 'delpttcjBgZhHaPS5QuL',
						name: 'delasd',
						email: 'delEmail',
						status: 'pending',
						type: 'admin',
						createdAt: new Date('2023-2-1'),
						imageUrls: [
							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
						]
					},
					itemStatus: 'pending'
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'paid',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	}
];
