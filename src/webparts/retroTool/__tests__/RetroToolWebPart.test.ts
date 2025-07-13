// Test for RetroTool WebPart
// This test validates that the web part can be loaded and initialized without errors

import { RetroToolWebPart } from '../RetroToolWebPart';

describe('RetroToolWebPart', () => {
  let webPart: RetroToolWebPart;
  
  beforeEach(() => {
    // Create a mock context for testing
    const mockContext: any = {
      pageContext: {
        user: {
          displayName: 'Test User',
          loginName: 'testuser@example.com'
        }
      },
      sdks: {
        microsoftTeams: null
      },
      isServedFromLocalhost: false
    };
    
    const mockManifest: any = {
      id: '7d2ba4b4-85b7-4b1c-a885-70aa27badb44',
      alias: 'RetroToolWebPart',
      componentType: 'WebPart'
    };
    
    // Create web part instance
    webPart = new RetroToolWebPart();
    
    // Mock the required properties
    (webPart as any).context = mockContext;
    (webPart as any).manifest = mockManifest;
    (webPart as any).properties = { description: 'Test Description' };
    (webPart as any).domElement = document.createElement('div');
  });

  afterEach(() => {
    // Clean up
    if (webPart && (webPart as any).domElement) {
      (webPart as any).domElement.innerHTML = '';
    }
  });

  it('should be instantiable', () => {
    expect(webPart).toBeDefined();
    expect(webPart).toBeInstanceOf(RetroToolWebPart);
  });

  it('should have valid manifest properties', () => {
    const manifest = (webPart as any).manifest;
    expect(manifest).toBeDefined();
    expect(manifest.id).toBe('7d2ba4b4-85b7-4b1c-a885-70aa27badb44');
    expect(manifest.alias).toBe('RetroToolWebPart');
    expect(manifest.componentType).toBe('WebPart');
  });

  it('should initialize without errors', async () => {
    // Mock the super.onInit method
    const originalOnInit = Object.getPrototypeOf(Object.getPrototypeOf(webPart)).onInit;
    Object.getPrototypeOf(Object.getPrototypeOf(webPart)).onInit = jest.fn().mockResolvedValue(undefined);
    
    await expect(webPart.onInit()).resolves.toBeUndefined();
    
    // Restore original method
    Object.getPrototypeOf(Object.getPrototypeOf(webPart)).onInit = originalOnInit;
  });

  it('should handle missing manifest gracefully', async () => {
    // Remove manifest to test error handling
    (webPart as any).manifest = undefined;
    
    await expect(webPart.onInit()).rejects.toThrow('Web part manifest is undefined during initialization');
  });

  it('should handle missing manifest ID gracefully', async () => {
    // Remove manifest ID to test error handling
    (webPart as any).manifest = { alias: 'Test', componentType: 'WebPart' };
    
    await expect(webPart.onInit()).rejects.toThrow('Web part manifest ID is undefined during initialization');
  });

  it('should render without errors when all dependencies are available', () => {
    // Mock console methods to avoid noise in tests
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();
    
    // This should not throw an error
    expect(() => webPart.render()).not.toThrow();
    
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('should render error fallback when RetroTool component is not available', () => {
    // Mock console methods to avoid noise in tests
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();
    
    // This should render an error fallback
    webPart.render();
    
    const domElement = (webPart as any).domElement;
    expect(domElement.innerHTML).toContain('Failed to load RetroTool');
    expect(domElement.innerHTML).toContain('RetroTool component is not available');
    
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });
});