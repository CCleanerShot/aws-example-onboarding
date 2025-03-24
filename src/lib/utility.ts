export const utility = {
    randomString: (length: number) => {
        let string = "";
        for (let i = 0; i < length; i++) {
            string += String.fromCharCode(utility.randomNumber(65, 90));
        }
        
        return string;
    },

    randomNumber: (min: number, max: number, round: boolean = true) => {
        const result = min + Math.random() * (max - min);

        if(!round) {
            return result
        } else {
            return Math.round(result)
        }
    },
} as const;
