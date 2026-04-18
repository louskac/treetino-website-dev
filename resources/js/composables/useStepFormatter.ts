export function useStepFormatter() {
    /* adds padding to numbers less than 10. Example: 1 -> "01" */
    const formatStep = (num: number): string => {
        return num.toString().padStart(2, '0');
    };

    return {
        formatStep
    };
}