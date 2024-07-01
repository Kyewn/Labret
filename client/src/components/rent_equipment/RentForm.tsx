import {TermsConditionsModal} from '@/components/rent_equipment/TermsConditionsModal';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {FormValues, NewRentFormValues} from '@/utils/data';
import {Button, ButtonGroup, Checkbox, Spacer, Text, VStack, useDisclosure} from '@chakra-ui/react';
import {addDays} from 'date-fns';
import {useEffect} from 'react';
import {UseFormRegister, UseFormSetValue, useForm} from 'react-hook-form';

export const RentForm: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {goToPrevious, handleAddRent} = useScanContext() as ReturnType<
		typeof useInitialScanContext
	>;
	const {
		register,
		watch,
		setValue,
		handleSubmit,
		formState: {errors}
	} = useForm<NewRentFormValues>();
	const {recordTitle, recordNotes, recordReturnDate, isReadTnC} = watch();
	const tcDisclosure = useDisclosure();
	const {onOpen} = tcDisclosure;

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	return (
		<>
			<TermsConditionsModal disclosure={tcDisclosure} />
			<form
				id='form'
				style={{flex: 1}}
				onSubmit={handleSubmit(() =>
					handleAddRent({recordTitle, recordNotes, recordReturnDate, isReadTnC})
				)}
			>
				<VStack height={'100%'} flex={1} paddingY={5} spacing={3} alignItems={'flex-start'}>
					<EditableField
						register={register as UseFormRegister<FormValues>}
						label={'Record title'}
						name={'recordTitle'}
						value={recordTitle}
						rules={{required: 'Record title is required.'}}
						errorMessage={errors.recordTitle?.message}
						isEditing
					/>
					<EditableField
						register={register as UseFormRegister<FormValues>}
						label={'Notes'}
						name={'recordNotes'}
						value={recordNotes}
						isEditing
					/>
					<EditableDate
						label={'Return Date'}
						name={'recordReturnDate'}
						value={recordReturnDate || addDays(new Date(), 3)}
						isEditing
						setValue={setValue as UseFormSetValue<FormValues>}
					/>
					<Spacer />
					<Checkbox colorScheme='lrBrown' {...register('isReadTnC')}>
						<Text>I agree to the terms and conditions below.</Text>
					</Checkbox>
					<Button variant={'criticalOutline'} onClick={onOpen}>
						Terms & conditions
					</Button>
				</VStack>
			</form>
			<ButtonGroup w={'100%'} justifyContent={'flex-end'} paddingY={5}>
				<Button variant={'secondary'} onClick={goToPrevious}>
					Back
				</Button>
				<Button type='submit' form='form'>
					Finish
				</Button>
			</ButtonGroup>
		</>
	);
};
