# Frontend Interaction Model

The SceneSolver UI is engineered around a minimal, specialized React application configured inside a dark-mode styled gradient utilizing React Router. Interaction focuses aggressively on media acquisition via dropzone UX and managing asynchronous state while processing occurs.

## User Interface & Experience (UX)

The focal point of the platform is the `ToolPage.jsx` component.

*   **Design Paradigm**: It utilizes "glassmorphism," implementing `backdrop-filter: blur(12px)` overlays on gradient backgrounds (`#1f1c2c, #928dab`) aiming for a modern UI.
*   **Media Ingestion Area**: A centralized dashed-border component operates dually as a click-to-browse trigger (`onClick={() => fileInputRef.current.click()}`) and as an HTML Drag-and-Drop canvas (`onDrop={handleDrop}`).
*   **Preview Capabilities**:
    *   **Images**: Statically loaded utilizing standard `<img>` tags bounded by `maxHeight` limiters.
    *   **Videos**: The UI actively mounts standard HTML5 `<video controls />` frames scaled smoothly to maintain a `56.25%` aspect ratio using CSS box positioning.
*   **Engagement Loops**: To mitigate perceived latency during processing delays natively imposed by the AI server, the UI iterates through a cyclical `crimeFacts` array every 10 seconds utilizing a `useEffect` hook interval, updating a text boundary at the bottom of the tool page.

## Data Flow Lifecycle

1.  **Selection**: Data enters `handleFile()`.
2.  **Blob Generation**: JavaScript intercepts the File Reference and constructs an Object URL (`URL.createObjectURL(file)`) injected into state (`previewUrl`) allowing rendering without triggering premature network uploads. Local state variable `isVideo` partitions rendering strategies.
3.  **Submission**: Activating the "Analyze Scene" button engages `analyzeFile()`.
4.  **Network Transport**:
    *   A JavaScript `FormData()` object maps the raw file into `'media'`.
    *   `axios.post('http://127.0.0.1:5000/analyze', formData)` initiates the transmission.
    *   A visual loading state (`Spinner` animation) spins while it awaits the synchronous request fulfillment via an await statement.
5.  **Rendering**: On response, validation mapping checks the JSON object and conditionally surfaces output fields alongside visual emojis for `crime`, `evidence` arrays (concatenated via `.join()`), and the `final_summary` narrative.

## File Download Feature

To support subsequent integrations without requiring backend-database integrations, the UI includes a self-contained JSON generation capability.
Calling `downloadReport()` leverages a front-end Blob structure stringifying the React state array, downloading directly from the browser's context `window.URL.createObjectURL(blob)` named `scene_analysis_report.json`.

## UI Architectural Shortcomings

*   **Hardcoded API URL**: Network queries statically address `'http://127.0.0.1:5000/analyze'`, making it completely incompatible with containerized Docker deployments or cloud implementations without source-code modifications since `localhost` differs within browser sandbox versus backend service layer networks.
*   **Insufficient Timeout Handing**: Axios defaults to system-defined timeouts. Under heavy load (BART models rendering lengthy narrative outputs from 30 video frames), the browser drops connections leading to a false failure state since error alerts genericize all errors locally without differentiating `timeout` from `500 Server Internals`.
*   **No File Constraints Check**: `ToolPage.jsx` does not constrain sizes; users could hypothetically inject multi-gigabyte files into the React buffer directly overflowing browser RAM limitations before Axios attempts uploading it to the Flask server.
