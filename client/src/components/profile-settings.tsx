import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X, User, Bell, Lock, Palette, Globe } from "lucide-react";
import { User as UserType } from "@shared/schema";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

interface ProfileSettingsProps {
  user: UserType;
  onSaveProfile?: (data: { username: string; email: string }) => Promise<void>;
}

export function ProfileSettings({ user, onSaveProfile }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email || "");
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put("/api/user/profile", {
        username,
        email,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form values
    setUsername(user.username);
    setEmail(user.email || "");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.username} />
                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <div className="p-3 bg-muted rounded-md">{user.username}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="p-3 bg-muted rounded-md">{user.email || "Not provided"}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleEdit}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your games and achievements
                  </p>
                </div>
                <Switch 
                  id="notifications"
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                  disabled={!isEditing}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Game Invites</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone invites you to play
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your gaming activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Change Password</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login History</Label>
                  <p className="text-sm text-muted-foreground">
                    View your recent login activity
                  </p>
                </div>
                <Button variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Language</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={darkMode ? "default" : "outline"} 
                    onClick={() => setDarkMode(true)}
                    className="flex-1"
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={darkMode ? "outline" : "default"} 
                    onClick={() => setDarkMode(false)}
                    className="flex-1"
                  >
                    Light
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 