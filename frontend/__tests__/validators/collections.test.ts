import { collectionsInput } from "@/validators/collections";

describe('Test Collections Input Validator', () => {
    it('Should be valid', () => {
        const data = {
            name: 'Test Collection',
            sets: [{
                comment: 'Test Comment',
                setID: 1,
            }],
            userId: 1,
        };        
        expect(collectionsInput.safeParse(data).success).toBe(true);    
    });

    it('Should be invalid', () => {
        const data = {
            name: 0,
            sets: [{
                setID: 'Not a number',
                comment: 0,
            }],
            userId: 'Not a number',
        };
        const result = collectionsInput.safeParse(data);
        expect(collectionsInput.safeParse(data).success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Expected string, received number'); 
        expect(result.error?.errors[1].message).toBe('Expected string, received number'); 
        expect(result.error?.errors[2].message).toBe('Expected number, received string'); 
        expect(result.error?.errors[3].message).toBe('Expected number, received string'); 
    });
});