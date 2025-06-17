const dummyCustomers = [
    { id: '1', name: 'Cliente A', email: 'a@example.com' },
    { id: '2', name: 'Cliente B', email: 'b@example.com' },
];

export const getCustomers = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyCustomers);
        }, 500); // Simulate network delay
    });
};

export const createCustomer = (newCustomer) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const customerWithId = { ...newCustomer, id: Date.now().toString() };
            dummyCustomers.push(customerWithId);
            resolve(customerWithId);
        }, 500);
    });
};