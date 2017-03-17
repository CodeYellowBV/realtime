import { User } from '../User';

test('fullName should update', () => {
    const user = new User();
    user.firstName = 'Henk';
    user.lastName = 'de Vries';
    expect(user.fullName).toBe('Henk de Vries');
});
