
// field counter
document.addEventListener('DOMContentLoaded', () => {
	
	const counters = document.querySelectorAll('.js-counter');

	counters.forEach(counter => {
		const btnPlus = counter.querySelector('.js-button-counter-plus');
		const btnMinus = counter.querySelector('.js-button-counter-minus');
		const input = counter.querySelector('.js-input-counter');

		const dataUnit = input.dataset.unit || '';
		const dataStepRaw = input.dataset.step || '1';
		const dataStep = parseFloat(dataStepRaw.replace(',', '.'));
		const dataMin = parseFloat(input.dataset.min) || 0;
		const dataMax = parseFloat(input.dataset.max) || Infinity;

		
		const decimalSeparator = dataStepRaw.includes(',') ? ',' : '.';

		
		const parseValue = (val) => {
			return parseFloat(val.replace(dataUnit, '').trim().replace(',', '.')) || dataMin;
		};

		
		const formatValue = (val) => {
			const decimals = (dataStepRaw.split(decimalSeparator)[1] || '').length;
			return val.toFixed(decimals) + dataUnit;
		};

		
		const updateButtons = (val) => {
			if (val <= dataMin) {
				btnMinus.classList.add('button-disabled');
			} else {
				btnMinus.classList.remove('button-disabled');
			}

			if (val >= dataMax) {
				btnPlus.classList.add('button-disabled');
			} else {
				btnPlus.classList.remove('button-disabled');
			}
		};

		
		let isInitialized = false;

		
		const initializeInput = () => {
			if (!isInitialized) {
				currentValue = dataMin;
				input.value = formatValue(currentValue);
				updateButtons(currentValue);
				isInitialized = true;
			}
		};

		
		let currentValue = null;
		const initialValueAttr = input.getAttribute('value');

		if (initialValueAttr !== null && initialValueAttr !== '') {
			
			let parsedInitialValue = parseFloat(initialValueAttr.replace(',', '.'));
			if (isNaN(parsedInitialValue)) {
				parsedInitialValue = dataMin;
			}
			parsedInitialValue = Math.max(dataMin, Math.min(parsedInitialValue, dataMax));

			
			const stepCount = Math.round((parsedInitialValue - dataMin) / dataStep);
			parsedInitialValue = parseFloat((dataMin + stepCount * dataStep).toFixed(10));

			currentValue = parsedInitialValue;
			input.value = formatValue(currentValue);
			isInitialized = true;
			updateButtons(currentValue);
		} else {
			
			input.value = '';
			updateButtons(dataMin); 
		}

		
		btnPlus.addEventListener('click', () => {
			initializeInput();
			if (btnPlus.classList.contains('button-disabled')) return;
			currentValue = parseFloat((currentValue + dataStep).toFixed(10));
			if (currentValue > dataMax) currentValue = dataMax;
			input.value = formatValue(currentValue);
			updateButtons(currentValue);
		});

		
		btnMinus.addEventListener('click', () => {
			initializeInput();
			if (btnMinus.classList.contains('button-disabled')) return;
			currentValue = parseFloat((currentValue - dataStep).toFixed(10));
			if (currentValue < dataMin) currentValue = dataMin;
			input.value = formatValue(currentValue);
			updateButtons(currentValue);
		});

		
		input.addEventListener('focus', () => {
			initializeInput();
			
			if (currentValue !== null) {
				input.value = parseValue(input.value).toString().replace('.', decimalSeparator);
			}
		});

		
		input.addEventListener('blur', () => {
			if (input.value === '') {
				
				currentValue = null;
				input.value = '';
				btnPlus.classList.remove('button-disabled');
				btnMinus.classList.remove('button-disabled');
				isInitialized = false;
				return;
			}

			let val = parseFloat(input.value.replace(',', '.'));
			if (isNaN(val)) {
				val = dataMin;
			}
			val = Math.max(dataMin, Math.min(val, dataMax));

			
			const stepCount = Math.round((val - dataMin) / dataStep);
			val = parseFloat((dataMin + stepCount * dataStep).toFixed(10));

			input.value = formatValue(val);
			currentValue = val;
			updateButtons(currentValue);
		});

		
		input.addEventListener('input', (e) => {
			let value = input.value;

			
			const regex = dataStepRaw.includes(',') ?
				/[^0-9,]/g :
				/[^0-9.]/g;
			value = value.replace(regex, '');

			
			const parts = value.split(decimalSeparator);
			if (parts.length > 2) {
				value = parts[0] + decimalSeparator + parts.slice(1).join('');
			}

			input.value = value;
		});

		
		input.addEventListener('change', () => {
			if (input.value === '') {
				currentValue = null;
				btnPlus.classList.remove('button-disabled');
				btnMinus.classList.remove('button-disabled');
				isInitialized = false;
				return;
			}

			let val = parseFloat(input.value.replace(',', '.'));
			if (isNaN(val)) {
				val = dataMin;
			}
			val = Math.max(dataMin, Math.min(val, dataMax));

			
			const remainder = (val - dataMin) / dataStep;
			if (!Number.isInteger(remainder)) {
				
				val = dataMin + Math.round(remainder) * dataStep;
			}

			input.value = formatValue(val);
			currentValue = val;
			updateButtons(currentValue);
		});
	});
});