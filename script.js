--[[
    WARNING: Heads up! This script has not been verified by ScriptBlox. Use at your own risk!
]]

repeat task.wait(0.25) until game:IsLoaded()
getgenv().Image = "rbxassetid://15298567397"
getgenv().ToggleUI = "E"

task.spawn(function()
    if not getgenv().LoadedMobileUI then
        getgenv().LoadedMobileUI = true
        local OpenUI = Instance.new("ScreenGui")
        local ImageButton = Instance.new("ImageButton")
        local UICorner = Instance.new("UICorner")
        
        OpenUI.Name = "OpenUI"
        OpenUI.Parent = game:GetService("CoreGui")
        OpenUI.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
        
        ImageButton.Parent = OpenUI
        ImageButton.BackgroundColor3 = Color3.fromRGB(105, 105, 105)
        ImageButton.BackgroundTransparency = 0.8
        ImageButton.Position = UDim2.new(0.9, 0, 0.1, 0)
        ImageButton.Size = UDim2.new(0, 50, 0, 50)
        ImageButton.Image = getgenv().Image
        ImageButton.Draggable = true
        ImageButton.Transparency = 1
        
        UICorner.CornerRadius = UDim.new(0, 200)
        UICorner.Parent = ImageButton
        
        ImageButton.MouseButton1Click:Connect(function()
            game:GetService("VirtualInputManager"):SendKeyEvent(true, getgenv().ToggleUI, false, game)
        end)
    end
end)

local Fluent = loadstring(game:HttpGet("https://github.com/dawid-scripts/Fluent/releases/latest/download/main.lua"))()

local Window = Fluent:CreateWindow({
    Title = "Fluent " .. Fluent.Version,
    SubTitle = "by dawid",
    TabWidth = 160,
    Size = UDim2.fromOffset(580, 460),
    Acrylic = true,
    Theme = "Dark",
    MinimizeKey = Enum.KeyCode.E
})

local Tabs = {
    _1 = Window:AddTab({ Title = "auto Fram", Icon = "" }),
    Informacoes = Window:AddTab({ Title = "INFORMAÇÕES", Icon = "info" })
}

Tabs._1:AddButton({
    Title = "auto kill",
    Description = "matar todos os titãs perto de vc",
    Callback = function()
       local function isPlayerAlive()
    local player = game.Players.LocalPlayer
    return player.Character and player.Character:FindFirstChild("Humanoid") and player.Character.Humanoid.Health > 0
end

-- Função para encontrar todos os Titans no container
local function getAllTitans()
    local titansContainer = workspace:FindFirstChild("Titans")
    if not titansContainer then
        warn("Container 'Titans' não encontrado no Workspace.")
        return {}
    end

    local titans = {}
    for _, titan in ipairs(titansContainer:GetChildren()) do
        if titan:IsA("Model") and titan:FindFirstChild("Humanoid") then
            table.insert(titans, titan)
        end
    end
    return titans
end

-- Função para atacar um Titan específico
local function attackTitan(titan)
    local replicatedStorage = game:GetService("ReplicatedStorage")
    local napeHitbox = titan:FindFirstChild("Hitboxes") and titan.Hitboxes.Hit:FindFirstChild("Nape")

    if napeHitbox then
        -- Prepara os argumentos para o ataque e o registro da hitbox
        local attackArgs = {
            [1] = "Attacks",
            [2] = "Slash",
            [3] = true
        }
        local hitboxArgs = {
            [1] = "Hitboxes",
            [2] = "Register",
            [3] = napeHitbox,
            [4] = 225483, -- RN_TEAM
            [5] = 925011  -- RN_TEAM
        }

        -- Executa o ataque e o registro da hitbox
        replicatedStorage.Assets.Remotes.POST:FireServer(unpack(attackArgs))
        replicatedStorage.Assets.Remotes.GET:InvokeServer(unpack(hitboxArgs))

        print("Atacou e registrou hitbox no Titã: " .. titan.Name)
    else
        warn("Nape hitbox não encontrada no Titã: " .. titan.Name)
    end
end

-- Função principal para atacar todos os Titans simultaneamente
local function attackAllTitans()
    while true do
        -- Verifica se o jogador está vivo
        if not isPlayerAlive() then
            warn("Jogador morto ou personagem inválido.")
            wait(1)
            break
        end

        -- Obtém todos os Titans
        local titans = getAllTitans()

        -- Itera sobre todos os Titans e os ataca simultaneamente
        for _, titan in ipairs(titans) do
            coroutine.wrap(attackTitan)(titan) -- Executa em uma nova thread
        end

        wait(0.1) -- Pequeno delay para evitar sobrecarga
    end
end

-- Inicia o script de ataque
attackAllTitans()
    end
})

Tabs._1:AddButton({
    Title = "teleporte titã",
    Description = "um teleporte que vai em todos os titãs",
    Callback = function()
       local teleportHeight = 160 -- Altura acima do Titan (ajuste conforme necessário)

-- Variáveis
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
local titansFolder = workspace:FindFirstChild("Titans") -- Pasta onde os Titans estão
local titans = {} -- Lista de Titans
local usedTitans = {} -- Titans já teleportados

-- Função para encontrar todos os Titans na pasta
local function findTitans()
    titans = {}
    if titansFolder then
        for _, titan in pairs(titansFolder:GetChildren()) do
            if titan:FindFirstChild("HumanoidRootPart") and titan:FindFirstChild("Humanoid") then
                table.insert(titans, titan)
            end
        end
    else
        warn("Pasta dos Titans não encontrada!")
    end
end

-- Função para teleportar para um Titan e esperar ele morrer (Humanoid ser removido)
local function teleportAndWaitForDeath(titan)
    local titanRootPart = titan.HumanoidRootPart
    local titanHumanoid = titan.Humanoid
    local targetPosition = titanRootPart.Position + Vector3.new(0, teleportHeight, 0)
    
    -- Teleporta para o Titan
    humanoidRootPart.CFrame = CFrame.new(targetPosition)
    
    -- Marca o Titan como usado
    table.insert(usedTitans, titan)
    
    -- Espera até que o Humanoid do Titan seja removido (Titan morrer)
    while titan:FindFirstChild("Humanoid") do
        wait(0)
    end
    
    -- Espera um pouco antes de verificar o próximo Titan
    wait(1)
end

-- Função para verificar se um Titan já foi usado
local function isTitanUsed(titan)
    for _, usedTitan in pairs(usedTitans) do
        if usedTitan == titan then
            return true
        end
    end
    return false
end

-- Função para manter o jogador parado no ar
local function keepPlayerFrozen()
    while true do
        humanoidRootPart.Velocity = Vector3.new(0, 0, 0) -- Zera a velocidade para evitar quedas
        humanoidRootPart.RotVelocity = Vector3.new(0, 0, 0) -- Zera a rotação
        wait(0.1)
    end
end

-- Função principal
local function main()
    -- Inicia a função para manter o jogador parado no ar
    coroutine.wrap(keepPlayerFrozen)()
    
    while true do
        findTitans() -- Atualiza a lista de Titans
        
        -- Verifica se há Titans novos
        for _, titan in pairs(titans) do
            if not isTitanUsed(titan) then
                teleportAndWaitForDeath(titan)
                break
            end
        end
        
        -- Se todos os Titans foram usados, reinicia a lista
        if #usedTitans >= #titans then
            usedTitans = {}
        end
        
        wait(0.5) -- Espera antes de verificar novamente
    end
end

-- Inicia o script
main()
    end
})

Tabs._1:AddButton({
    Title = "auto titã femea",
    Description = "fica em cima da titã femea",
    Callback = function()
       local player = game.Players.LocalPlayer

local basePath = workspace.Unclimbable.Objective

local function teleportToTarget(targetName, altura)
    local target = basePath:FindFirstChild(targetName)
    if target then
        if target:IsA("BasePart") then
            local character = player.Character
            if character and character:FindFirstChild("HumanoidRootPart") then
                local humanoidRootPart = character.HumanoidRootPart
                humanoidRootPart.CFrame = target.CFrame + Vector3.new(0, target.Size.Y / 2 + altura, 0)
                print("Personagem teleportado para cima da parte: " .. targetName)
            end
        elseif target:IsA("Model") then
            local character = player.Character
            if character and character:FindFirstChild("HumanoidRootPart") then
                local humanoidRootPart = character.HumanoidRootPart
                local modelCenter = target:GetModelCFrame().Position
                humanoidRootPart.CFrame = CFrame.new(modelCenter) + Vector3.new(0, altura, 0)
                print("Personagem teleportado para cima do modelo: " .. targetName)
            end
        else
            warn("O alvo não é uma Part ou Model.")
        end
    else
        warn("Alvo não encontrado: " .. targetName)
    end
end

local function freezePlayer()
    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        local humanoidRootPart = character.HumanoidRootPart
        humanoidRootPart.Anchored = true
        print("Personagem congelado.")
    else
        warn("Personagem ou HumanoidRootPart não encontrados.")
    end
end

local function unfreezePlayer()
    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        local humanoidRootPart = character.HumanoidRootPart
        humanoidRootPart.Anchored = false
        print("Personagem descongelado.")
    else
        warn("Personagem ou HumanoidRootPart não encontrados.")
    end
end

-- Exemplo de uso
local targetName = "Guard"
local altura = 150

teleportToTarget(targetName, altura)

task.wait(1)

freezePlayer()

--RN_TEAM
    end
})

Tabs.Informacoes:AddParagraph({
    Title = "INFORMAÇÕES DO SERVIDOR",
    Content = "Jogadores online: " .. #game:GetService("Players"):GetPlayers() .. "\n" ..
              "Máximo de jogadores: " .. game:GetService("Players").MaxPlayers
})

Tabs.Informacoes:AddButton({
    Title = "REINICIAR SERVIDOR",
    Description = "Reinicia o jogo e mantém o mesmo servidor.",
    Callback = function()
        local currentPlayer = game.Players.LocalPlayer
        local currentServerId = game.JobId
        
        game:Shutdown()
        
        task.wait(5)
        game:GetService("TeleportService"):TeleportToPlaceInstance(game.PlaceId, currentServerId)
    end
})

Fluent:Notify({
    Title = "Notificação",
    Content = "Este é um aviso inicial",
    SubContent = "SubContent",
    Duration = 5
})

SaveManager:SetLibrary(Fluent)
InterfaceManager:SetLibrary(Fluent)

SaveManager:IgnoreThemeSettings()
SaveManager:SetIgnoreIndexes({})

InterfaceManager:SetFolder("FluentScriptHub")
SaveManager:SetFolder("FluentScriptHub/specific-game")

InterfaceManager:BuildInterfaceSection(Tabs.Informacoes)
SaveManager:BuildConfigSection(Tabs.Informacoes)

Window:SelectTab(1)

Fluent:Notify({
    Title = "Fluent",
    Content = "O script foi carregado.",
    Duration = 8
})

SaveManager:LoadAutoloadConfig()