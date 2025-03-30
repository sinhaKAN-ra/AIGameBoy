import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocsPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  
  // Fetch user's API key
  const { 
    data: apiKeyData, 
    isLoading: isLoadingKey,
    refetch: refetchApiKey
  } = useQuery({
    queryKey: ["/api/user/api-key"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/api-key");
      return await res.json();
    },
    enabled: !!user,
  });
  
  const apiKey = apiKeyData?.apiKey;
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleRegenerateKey = async () => {
    try {
      setRegenerating(true);
      await apiRequest("POST", "/api/user/api-key/regenerate");
      refetchApiKey();
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate API key.",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };
  
  // Example code snippets
  const curlExample = `curl -X POST https://your-website.com/api/scores \\
  -H "Content-Type: application/json" \\
  -d '{ 
    "gameId": 1, 
    "score": 1000, 
    "apiKey": "${apiKey || 'YOUR_API_KEY'}" 
  }'`;
  
  const javascriptExample = `// Using fetch
fetch('https://your-website.com/api/scores', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    gameId: 1,
    score: 1000,
    apiKey: "${apiKey || 'YOUR_API_KEY'}"
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

  const pythonExample = `import requests

response = requests.post(
  'https://your-website.com/api/scores',
  json={
    'gameId': 1,
    'score': 1000,
    'apiKey': "${apiKey || 'YOUR_API_KEY'}"
  }
)
print(response.json())`;

  const unityExample = `using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;

public class ScoreSubmitter : MonoBehaviour
{
    [SerializeField] private string apiUrl = "https://your-website.com/api/scores";
    [SerializeField] private string apiKey = "${apiKey || 'YOUR_API_KEY'}";
    [SerializeField] private int gameId = 1;

    public void SubmitScore(int score)
    {
        StartCoroutine(SendScore(score));
    }

    private IEnumerator SendScore(int score)
    {
        string jsonData = $"{{\\\"gameId\\\":{gameId},\\\"score\\\":{score},\\\"apiKey\\\":\\\"{apiKey}\\\"}}";
        
        UnityWebRequest request = new UnityWebRequest(apiUrl, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        
        yield return request.SendWebRequest();
        
        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("Score submitted successfully");
            Debug.Log(request.downloadHandler.text);
        }
        else
        {
            Debug.LogError("Error submitting score: " + request.error);
        }
    }
}`;

  // If user is not logged in, prompt them to do so
  if (!user && !isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please login to access your API key and documentation
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => window.location.href = "/auth"}>Login</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Games API Documentation</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your API Key</CardTitle>
            <CardDescription>
              Use this key to authenticate your game when submitting scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingKey ? (
              <div className="bg-muted p-4 rounded flex items-center justify-center">
                <p>Loading your API key...</p>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded flex items-center justify-between">
                <code className="font-mono">{apiKey}</code>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCopy(apiKey, 'apiKey')}
                >
                  {copied === 'apiKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleRegenerateKey} disabled={regenerating}>
              {regenerating ? 'Regenerating...' : 'Regenerate API Key'}
            </Button>
            <p className="text-sm text-muted-foreground ml-4">
              Warning: Regenerating your API key will invalidate your previous key
            </p>
          </CardFooter>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Score Submission API</h2>
          <p className="mb-4">
            Use our API to submit player scores directly from your game. Each score submission
            requires your API key for authentication.
          </p>
          
          <div className="grid gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="font-mono">POST /api/scores</code>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Request Body</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono mb-2">&#123;</p>
                <p className="font-mono ml-4 mb-1">"gameId": number, <span className="text-muted-foreground">// The ID of your game</span></p>
                <p className="font-mono ml-4 mb-1">"score": number, <span className="text-muted-foreground">// The player's score (must be positive)</span></p>
                <p className="font-mono ml-4 mb-1">"apiKey": string <span className="text-muted-foreground">// Your API key for authentication</span></p>
                <p className="font-mono">&#125;</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono mb-2">// Success (200 OK)</p>
                <p className="font-mono mb-2">&#123;</p>
                <p className="font-mono ml-4 mb-1">"id": number, <span className="text-muted-foreground">// The ID of the submitted score</span></p>
                <p className="font-mono ml-4 mb-1">"userId": number, <span className="text-muted-foreground">// The ID of the user (from API key)</span></p>
                <p className="font-mono ml-4 mb-1">"gameId": number, <span className="text-muted-foreground">// The ID of the game</span></p>
                <p className="font-mono ml-4 mb-1">"score": number, <span className="text-muted-foreground">// The submitted score</span></p>
                <p className="font-mono ml-4 mb-1">"createdAt": string <span className="text-muted-foreground">// Timestamp of submission</span></p>
                <p className="font-mono">&#125;</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
          
          <Tabs defaultValue="curl">
            <TabsList className="mb-4">
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="unity">Unity C#</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curl">
              <Card>
                <CardHeader>
                  <CardTitle>cURL Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded relative">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{curlExample}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(curlExample, 'curl')}
                    >
                      {copied === 'curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="javascript">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded relative">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{javascriptExample}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(javascriptExample, 'javascript')}
                    >
                      {copied === 'javascript' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="python">
              <Card>
                <CardHeader>
                  <CardTitle>Python Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded relative">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{pythonExample}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(pythonExample, 'python')}
                    >
                      {copied === 'python' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="unity">
              <Card>
                <CardHeader>
                  <CardTitle>Unity C# Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded relative">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{unityExample}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(unityExample, 'unity')}
                    >
                      {copied === 'unity' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tips for Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-2">
              <li>Store your API key securely in your game's configuration.</li>
              <li>Implement error handling to retry score submission if the network connection fails.</li>
              <li>Consider submitting scores at appropriate game milestones (level completion, game over, etc.).</li>
              <li>Remember that users can earn credits by playing games - there's a chance they receive a credit when they submit a score!</li>
              <li>Make sure your game ID is correct by checking your profile page after creating a game.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}