import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

test('Button renders correctly', () => {
    const tree = renderer.create(
        <Button>Yes!</Button>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
