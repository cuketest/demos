Feature: Image automation
Demonstration of image automation with the help of Qt application appchooser

  Scenario: Automation for appchooser samples
    When Launch the app and wait
    When Cycle through the four patterns 2 times and count the recognition time

  Scenario: API for testing image automation
    When Launch the app and wait
    When Verify that the camera is not centered at this time
    Then Click "Camera"
    Then Verify that the camera is now centered

  @only-windows
  Scenario: Testing the Virtual Controls API
    Given Launch the app and wait
    When Click on the cascade virtual control "Dictionary Virtual Control (Win)"
    Then Verify that the camera is not centered at this time
    When Virtualize clicking the top-left corner through Windows controls
    Then Verify that the camera is now centered

  @only-full
  Scenario: Test the virtual control API under Qt
    Given Launch the Qt app and wait
    When Click on the cascade virtual control "Camera Virtual Control (Qt)"
    Then Verify that the camera is now centered
    When Click on the top right corner by Windows Control Virtualization
    Then Verify that the camera is not centered at this time