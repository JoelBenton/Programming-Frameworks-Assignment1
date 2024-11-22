import { setsInput } from "@/validators/sets";

describe('Test Sets Input Validator', () => {
    it('Should be valid', () => {
        const data = {
            id: 1,
            name: 'Test Set',
            user_id: 1,
            cards: [{
                id: 1,
                question: 'Question 1',
                answer: 'Answer 1',
                difficulty: 'easy',
            }],
            created_at: new Date(),
            updated_at: new Date(),
        };

        expect(setsInput.safeParse(data).success).toBe(true);    
    });

    it('Should be invalid', () => {
        const data = {
            id: 1,
            name: '',
            user_id: 1,
            cards: [{
                id: 1,
                question: 'Question 1',
                answer: 'Answer 1',
                difficulty: 'easy',
            }],
            created_at: new Date(),
            updated_at: new Date(),
        };

        expect(setsInput.safeParse(data).success).toBe(false);    
    });
});