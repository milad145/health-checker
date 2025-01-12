export default class TokenGenerator {
    /**
     *
     * @param length {Number}
     * @param hasNumbers {Boolean}
     * @param hasLowercase {Boolean}
     * @param hasUppercase {Boolean}
     * @param hasPunctuation {Boolean}
     */
    constructor(length = 12, hasNumbers = true, hasLowercase = true, hasUppercase = true, hasPunctuation = true) {
        this.length = length;
        this.hasNumbers = hasNumbers;
        this.hasLowercase = hasLowercase;
        this.hasUppercase = hasUppercase;
        this.hasPunctuation = hasPunctuation;
    }

    /**
     * generate custom password
     * @returns {string}
     */
    newToken() {
        const numbers = '0123456789';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const punctuation = '!@#$%^&*()_+[]{}|;:,.<>?';

        let characterPool = '';

        if (this.hasNumbers) characterPool += numbers;
        if (this.hasLowercase) characterPool += lowercase;
        if (this.hasUppercase) characterPool += uppercase;
        if (this.hasPunctuation) characterPool += punctuation;

        if (characterPool.length === 0) {
            throw new Error('No character types selected for password generation.');
        }

        let password;
        do {
            password = '';
            for (let i = 0; i < this.length; i++) {
                const randomIndex = Math.floor(Math.random() * characterPool.length);
                password += characterPool[randomIndex];
            }
        } while (!this.meetsCriteria(password));

        return password;
    }

    /**
     * Helper function to check if the password meets the requirements
     * @param password {String}
     * @returns {boolean}
     */
    meetsCriteria(password) {
        if (this.length && password.length !== this.length) return false;
        if ((this.hasNumbers && !/\d/.test(password)) || (!this.hasNumbers && /\d/.test(password))) return false;
        if ((this.hasLowercase && !/[a-z]/.test(password)) || (!this.hasLowercase && /[a-z]/.test(password))) return false;
        if ((this.hasUppercase && !/[A-Z]/.test(password)) || (!this.hasUppercase && /[A-Z]/.test(password))) return false;
        if ((this.hasPunctuation && !/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password)) || (!this.hasPunctuation && /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password))) return false;

        return true;
    }
}
