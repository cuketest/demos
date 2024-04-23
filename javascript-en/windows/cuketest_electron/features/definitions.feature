Feature: Verify toolbar functionality
Verify the following functions:  
  New Feature/Script
  New Project
  Open
  Open Project
  Save
  Run Project
  Run Feature/Script

  Scenario: New Feature/Script
    * Click "feature" in the "New Feature" drop-down button
    * Click "Save" button
    * Save as "newDropdownFeature"
    * Verify that the "newDropdownFeature.feature" file exists
    * Click "javascript" in the "New Feature" drop-down button
    * Click "Save" button
    * Save as "newDropdownScript"
    * Verify that the "newDropdownScript.js" file exists

  Scenario: Run Project
    * Open project "../public/math"
    * Click "Run Project" button
    * Wait for the run to finish
    * The running results appear in the output column include the following
      """
      run project
      """

  Scenario: Run Feature/Script
    * Open project "../public/math"
    * Open file "../public/math/features/simple math.feature"
    * Click "Run Feature" button
    * The running results appear in the output column include the following
      """
      scenario
      """
    * Open project "../public/math"
    * Open file "../public/math/test.js"
    * Click "Run Script" button
    * The running results appear in the output column include the following
      """
      run script
      """

  Scenario: Open Model Manager
    When Click the "Model Manager" button to open a new window
    When Screenshot Model Manager
    Then Close the model manager