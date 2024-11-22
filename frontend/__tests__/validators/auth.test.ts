import { usernameInput, passwordInput, authInput } from "@/validators/auth";

describe('Test Auth Input Validator', () => {
    it('Should be valid', () => {
        const data = {
            username: 'Test User',
            password: '@Password123',
        };        
        expect(authInput.safeParse(data).success).toBe(true);    
    });

    it('Should be invalid', () => {
        const data = {
            username: 0,
            password: 0,
        };
        const result = authInput.safeParse(data);
        expect(authInput.safeParse(data).success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Expected string, received number'); 
        expect(result.error?.errors[1].message).toBe('Expected string, received number'); 
    });
});

describe('Test Username Input Validator', () => {
    it('Should be valid', () => {
        const data = { username: 'Test User' };        
        expect(usernameInput.safeParse(data).success).toBe(true);    
    });

    it('Should be invalid', () => {
        const data = { username: 0 };
        const result = usernameInput.safeParse(data);
        expect(usernameInput.safeParse(data).success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Expected string, received number'); 
    });
});

describe('Test Password Input Validator', () => {
    it('Should be valid', () => {
        const data = { password: '@Password123' };        
        expect(passwordInput.safeParse(data).success).toBe(true);    
    });

    it('Should be invalid', () => {
        const data = { password: 0 };
        const result = passwordInput.safeParse(data);
        expect(passwordInput.safeParse(data).success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Expected string, received number'); 
    });
});