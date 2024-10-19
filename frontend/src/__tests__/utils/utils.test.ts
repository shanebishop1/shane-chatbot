import { isIOSDevice, hasVerticalScrollbar } from '../../utils/utils';

describe('utils tests', () => {
  describe('isIOSDevice tests', () => {
    let originalNavigator: typeof navigator;

    beforeEach(() => {
      // Store the original navigator object
      originalNavigator = global.navigator;
    });

    afterEach(() => {
      // Restore the original navigator object after each test
      global.navigator = originalNavigator;
    });

    it('should return true if the platform is iOS', () => {
      global.navigator = {
        ...originalNavigator,
        platform: 'iPhone',
      } as typeof navigator;
      expect(isIOSDevice()).toBe(true);
    });

    it('should return false if the platform is not iOS', () => {
      // Create a mock navigator object with platform set to 'Android'
      global.navigator = {
        ...originalNavigator,
        platform: 'Android',
      } as typeof navigator;
      expect(isIOSDevice()).toBe(false);
    });
  });

  describe('hasVerticalScrollBar tests', () => {
    afterEach(() => {
      // Clear the document body after each test
      document.body.innerHTML = '';
    });

    it('should return true if the element has a vertical scrollbar', () => {
      // Create a mock element
      const element = document.createElement('div');
      element.className = 'test';

      // Manually set scrollHeight and clientHeight
      Object.defineProperties(element, {
        scrollHeight: { value: 100 },
        clientHeight: { value: 50 },
      });

      // Append the mock element to the body
      document.body.appendChild(element);

      expect(hasVerticalScrollbar('test')).toBe(true);
    });

    it('should return false if the element does not have a vertical scrollbar', () => {
      // Create a mock element
      const element = document.createElement('div');
      element.className = 'test';

      // Manually set scrollHeight and clientHeight
      Object.defineProperties(element, {
        scrollHeight: { value: 50 },
        clientHeight: { value: 100 },
      });

      // Append the mock element to the body
      document.body.appendChild(element);

      expect(hasVerticalScrollbar('test')).toBe(false);
    });

    it('should return false if the element does not exist', () => {
      expect(hasVerticalScrollbar('nonexistent')).toBe(false);
    });
  });
});
