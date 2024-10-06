import {EditableField} from '@/components/ui/EditableField';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {FormValues, ReturnFormValues} from '@/utils/data';
import {Button, ButtonGroup, VStack} from '@chakra-ui/react';
import {useEffect} from 'react';
import {UseFormRegister, useForm} from 'react-hook-form';

export const ReturnForm: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {goToPrevious, targetRecordState, scanResultState, handleReturnRecord} =
		useScanContext() as ReturnType<typeof useInitialScanContext>;
	const [scanResult] = scanResultState;
	const [targetRecord] = targetRecordState;
	const {
		register,
		watch,
		handleSubmit,
		formState: {errors}
	} = useForm<ReturnFormValues>();
	const {returnLocation, returnNotes} = watch();

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
			<form
				id='form'
				style={{flex: 1}}
				onSubmit={handleSubmit(() =>
					handleReturnRecord(targetRecord?.recordId as string, {
						returnLocation,
						returnNotes,
						rentingItemsWithImageProof: scanResult
					})
				)}
			>
				<VStack height={'100%'} flex={1} paddingY={5} spacing={3} alignItems={'flex-start'}>
					<EditableField
						register={register as UseFormRegister<FormValues>}
						label={'Return location'}
						name={'returnLocation'}
						value={returnLocation}
						rules={{required: 'Return location is required.'}}
						errorMessage={errors.returnLocation?.message}
						isEditing
					/>
					<EditableField
						register={register as UseFormRegister<FormValues>}
						label={'Return notes'}
						name={'returnNotes'}
						value={returnNotes}
						isEditing
					/>
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
