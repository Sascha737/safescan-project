export default function ResourcesPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4">Learning Resources</h1>
      <p className="mb-4">Explore these trusted resources to deepen your understanding of web security concepts:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OWASP Top Ten</a> – The most critical security risks to web applications.
        </li>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Web/Security" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MDN Web Docs: Security</a> – Practical guides and explanations for web developers.
        </li>
        <li>
          <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PortSwigger Web Security Academy</a> – Free interactive labs and tutorials.
        </li>
        <li>
          <a href="https://www.freecodecamp.org/news/tag/security/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">freeCodeCamp Security Articles</a> – Beginner-friendly articles on security topics.
        </li>
        <li>
          <a href="https://www.hacksplaining.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Hacksplaining</a> – Interactive lessons on common vulnerabilities.
        </li>
      </ul>
    </div>
  );
}
