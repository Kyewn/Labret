// Reqs:
// 1. retrain model button
// 2. status toggling func from pending -> active

import {DataTable} from '@/components/ui/DataTable/DataTable';
import {UserFilters} from '@/components/view_users/UserFilters';
import {UserTableContext, useUsersTableContext} from '@/utils/context/UsersTableContext';
import {User, userColumns} from '@/utils/dataType';
import {
	Button,
	ButtonGroup,
	Divider,
	Flex,
	HStack,
	Heading,
	IconButton,
	Slide,
	Spacer,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';

export function ViewUsers() {
	const usersTableContext = useUsersTableContext();
	const {isOpen, onOpen, onClose} = useDisclosure(); // Selection actions modal

	const {
		dataState,
		searchTextState,
		tableFiltersState,
		tableSortingState,
		limitState,
		handleInitTable,
		refetch
	} = usersTableContext;
	const [data] = dataState;
	const [limit] = limitState;

	const handleRowClick = (data: User) => {
		console.log(data);
	};

	useEffect(() => {
		refetch(limit);
	}, []);

	return (
		<>
			<Helmet>
				<title>View Users</title>
			</Helmet>

			<UserTableContext.Provider value={usersTableContext}>
				<Flex flex={1} flexDirection={'column'} justifyContent={'center'} p={3} paddingX={10}>
					<Heading size={''}>Users</Heading>
					<UserFilters />
					<Divider orientation='horizontal' />
					<DataTable
						columns={userColumns}
						data={data || []}
						globalFilterState={searchTextState}
						filterState={tableFiltersState}
						sortingState={tableSortingState}
						handleInitTable={handleInitTable}
						handleRowClick={handleRowClick}
					/>
				</Flex>
				<Button
					position={'fixed'}
					bottom={10}
					left={0}
					right={0}
					w={'20rem'}
					margin={'auto'}
					leftIcon={<SquareCheck />}
					onClick={onOpen}
				>
					Selection Actions
				</Button>

				<Slide direction='bottom' in={isOpen}>
					<HStack
						flexDirection={'column'}
						p={5}
						paddingTop={2}
						backgroundColor={'white'}
						boxShadow={'0 0 9px 0 var(--chakra-colors-gray-400)'}
					>
						<IconButton
							width={'20rem'}
							aria-label={'toggle-selection-actions'}
							variant={'iconButton'}
							icon={<ChevronDown />}
							onClick={onClose}
						/>
						<Flex w={'100%'} alignItems={'center'}>
							<Text>x records selected</Text>
							<Spacer />
							<ButtonGroup>
								<Button>Action 1</Button>
								<Button variant={'secondary'}>Action 1</Button>
							</ButtonGroup>
						</Flex>
					</HStack>
				</Slide>
			</UserTableContext.Provider>
		</>
	);
}
