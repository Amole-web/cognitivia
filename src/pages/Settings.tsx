import {
  Button,
  Card,
  Disclosure,
  DisclosureBody,
  DisclosureContent,
  DisclosureIndicator,
  DisclosureTrigger,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from '@heroui/react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useState } from 'react'
import { resetAllData } from '../data/db'
import { useSettings } from '../context/SettingsContext'
import { useToasts } from '../context/ToastContext'

const difficultyOptions = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
]

export const Settings = () => {
  const { settings, updateSettings } = useSettings()
  const { pushToast } = useToasts()
  const [resetting, setResetting] = useState(false)

  const handleResetData = async () => {
    const confirmed = window.confirm('Reset all study data? This cannot be undone.')
    if (!confirmed) return
    setResetting(true)
    await resetAllData()
    setResetting(false)
    pushToast({ title: 'All data reset', tone: 'warning' })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.3em] text-[color:var(--fg-soft)]">Settings</div>
        <h1 className="text-2xl font-semibold text-[color:var(--fg)]">Personalize Cognitivia</h1>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
          Your API key never leaves this browser. Settings are stored locally.
        </p>
      </div>

      <Card className="glass-panel border border-white/10 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-xs text-[color:var(--fg-muted)]">Theme</Label>
            <div className="mt-3">
              <ThemeToggle />
            </div>
          </div>
          <div>
            <Label className="text-xs text-[color:var(--fg-muted)]">Default Difficulty</Label>
            <RadioGroup
              className="mt-2 flex flex-wrap gap-3"
              value={settings.difficulty}
              onChange={(value: string) =>
                updateSettings({ difficulty: value as 'easy' | 'medium' | 'hard' })
              }
            >
              {difficultyOptions.map((option) => (
                <Radio key={option.key} value={option.key} className="text-[color:var(--fg-muted)]">
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
      </Card>

      <Card className="glass-panel border border-white/10 p-6">
        <div className="text-sm font-semibold text-[color:var(--fg)]">BYOK API</div>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
          Provide an API URL that accepts chat-completions style requests. The key is stored only
          in localStorage and sent directly to the API endpoint from your browser.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            value={settings.apiUrl}
            onChange={(value: string) => updateSettings({ apiUrl: value })}
          >
            <Label>API URL</Label>
            <Input placeholder="https://your-api.example.com/chat/completions" />
          </TextField>
          <TextField
            value={settings.apiKey}
            onChange={(value: string) => updateSettings({ apiKey: value })}
          >
            <Label>API Key</Label>
            <Input type="password" />
          </TextField>
          <div className="md:col-span-2">
            <Disclosure className="mt-1 rounded-2xl border border-white/10 bg-white/5 p-3">
              <DisclosureTrigger className="flex w-full items-center justify-between text-xs text-[color:var(--fg-muted)]">
                <span>Don't have an API key?</span>
                <DisclosureIndicator />
              </DisclosureTrigger>
              <DisclosureContent>
                <DisclosureBody className="mt-3 space-y-2 text-xs text-[color:var(--fg-muted)]">
                  <div>
                    <span className="text-[color:var(--fg)]">OpenRouter (recommended)</span>: create
                    an account, open the API keys page, and generate a new key.
                  </div>
                  <div>
                    <span className="text-[color:var(--fg)]">OpenAI</span>: log in, go to API Keys,
                    and create a new secret key.
                  </div>
                  <div>Note: your key is stored only in this browser (localStorage).</div>
                </DisclosureBody>
              </DisclosureContent>
            </Disclosure>
          </div>
          <TextField
            value={settings.model}
            onChange={(value: string) => updateSettings({ model: value })}
          >
            <Label>Model</Label>
            <Input placeholder="auto" />
          </TextField>
          <Button
            className="h-[56px] self-end bg-white/10 text-[color:var(--fg)]"
            variant="ghost"
            onPress={() => updateSettings({ apiKey: '' })}
          >
            Clear API Key
          </Button>
        </div>
      </Card>

      <Card className="glass-panel border border-white/10 p-6">
        <div className="text-sm font-semibold text-[color:var(--fg)]">Reset</div>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
          Reset study sets, generated content, and progress analytics. This keeps your app settings
          but clears stored data.
        </p>
        <Button
          className="mt-4 bg-rose-500/80 text-white"
          variant="danger"
          isDisabled={resetting}
          onPress={handleResetData}
        >
          {resetting ? 'Resetting...' : 'Reset Study Data'}
        </Button>
      </Card>
    </div>
  )
}
