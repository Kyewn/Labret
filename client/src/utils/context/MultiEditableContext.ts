import {InputData} from '@/utils/data';
import {useEffect, useState} from 'react';

// MultiEditableContext - states and functions for edit page where multiple inputs can be toggled to edit mode
type MultiEditableContext = {
	data?: InputData;
	oldData?: InputData;
	isEditing: boolean;
};
export const useMultiEditableContext = (initData: InputData | undefined) => {
	const [{data, oldData, isEditing}, setMEContext] = useState<MultiEditableContext>({
		oldData: initData,
		data: initData,
		isEditing: false
	});

	useEffect(() => {
		setMEContext({
			oldData: initData,
			data: initData,
			isEditing: false
		});
	}, [initData]);

	const onEdit = () => {
		setMEContext((prev) => ({...prev, isEditing: true}));
	};
	const onCancel = () => {
		setMEContext((prev) => ({...prev, data: oldData, isEditing: false}));
	};
	const onChange = (newData: InputData) => {
		setMEContext((prev) => {
			return {
				...prev,
				data: {
					...prev.data,
					...(newData as InputData)
				}
			};
		});
	};
	const onSubmit = async (handleSubmit?: (newData: InputData) => Promise<void>) => {
		if (JSON.stringify(data) != JSON.stringify(oldData)) {
			setMEContext((prev) => {
				prev?.data && handleSubmit?.(prev.data);
				return {
					...prev,
					oldData: data,
					isEditing: false
				};
			});
		} else {
			onCancel();
		}
	};

	return {
		data,
		isEditing,
		onEdit,
		onCancel,
		onChange,
		onSubmit
	};
};
